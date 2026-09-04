import "server-only";

// import dns from "node:dns";

import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { API_URL, API_TIMEOUT_MS } from "@/constants/api_base";
import { ApiError, parseApiError } from "@/lib/api/errors";
import { SESSION_COOKIE } from "@/lib/auth/constants";

// A API vive atrás de Cloudflare, que devolve registos AAAA (IPv6) e A (IPv4)
// para o mesmo domínio. O runtime das Vercel Functions (Lambda) não tem rota
// de saída IPv6 — sem isto, o Node tenta ligar por IPv6 primeiro, a ligação
// fica presa (sem erro, sem timeout do socket a disparar) e o pedido nunca
// chega à API. Forçar IPv4 aqui resolve; ver Docs/ARQUITETURA_FRONTEND.md.
// dns.setDefaultResultOrder("ipv4first");

/**
 * Cliente HTTP central para a API FastAPI do C-Trip, baseado em Axios.
 *
 * Toda a app (Server Components, Server Actions) passa por aqui — nunca por
 * `fetch` directo. Este módulo centraliza:
 *  - baseURL do backend (vem de `constants/api_base.ts`);
 *  - injeção de `Authorization: Bearer <token>` a partir do cookie httpOnly;
 *  - normalização dos dois formatos de erro do backend para `ApiError`;
 *  - tratamento de sessão expirada (401) → limpa cookie → `/login?expired=1`;
 *  - timeout e retry para falhas de rede em pedidos idempotentes.
 */

type ApiFetchOptions = Omit<
  InternalAxiosRequestConfig,
  "url" | "baseURL" | "headers" | "auth" | "data"
> & {
  /** Corpo do pedido — serializado como JSON automaticamente. */
  body?: unknown;
  /**
   * Envia `Authorization: Bearer <token>` a partir do cookie de sessão.
   * `false` só para os poucos endpoints públicos (login, registo, pesquisa de cidades...).
   * Omitir = `true`.
   */
  auth?: boolean;
  headers?: Record<string, string>;
};

const NETWORK_RETRY_ATTEMPTS = 2;
const NETWORK_RETRY_DELAY_MS = 200;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Interceptor de resposta — trata erros de forma centralizada, antes de chegarem
// aos módulos de domínio. Não lançar aqui o redirect de 401: o redirect do Next
// só é seguro dentro de um contexto de servidor; lançamos o `ApiError` e é o
// `apiFetch` que decide (e só ele tem acesso ao cookie para o limpar).
axiosInstance.interceptors.response.use(
  (response) => response,
  // `async` de propósito: `parseApiError` devolve uma Promise. Se a rejeitássemos
  // sem `await`, o resto da app receberia a Promise em vez do `ApiError` — e
  // `error instanceof ApiError` seria sempre falso (nunca mostrava o 403 real,
  // nunca fazia logout no 401).
  async (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const parsed = await parseApiError(axiosError.response);
        if (process.env.NODE_ENV !== "production") {
          console.error(
            `[api] ${axiosError.config?.method?.toUpperCase()} ${axiosError.config?.url} → ${parsed.status}`,
            parsed.detail ?? parsed.message,
          );
        }
        throw parsed;
      }
      if (process.env.NODE_ENV !== "production") {
        console.error(
          `[api] ${axiosError.config?.method?.toUpperCase()} ${axiosError.config?.url} → sem resposta`,
          axiosError.code,
        );
      }
      // Erro de rede / timeout — sem resposta do servidor.
      throw new ApiError(
        0,
        axiosError.code === "ECONNABORTED"
          ? "A ligação ao servidor demorou demasiado. Tenta novamente."
          : "Não foi possível ligar ao servidor. Verifica a tua ligação.",
      );
    }
    throw error;
  },
);

async function fetchWithNetworkRetry<T>(
  request: () => Promise<T>,
  retryable: boolean,
): Promise<T> {
  const attempts = retryable ? NETWORK_RETRY_ATTEMPTS : 1;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await request();
    } catch (error) {
      // O interceptor já converteu tudo em `ApiError`; `status === 0` é o caso
      // "sem resposta" (rede/timeout) — o único que vale a pena retentar.
      const isNetworkFailure = error instanceof ApiError && error.status === 0;
      if (isNetworkFailure && attempt < attempts) {
        await sleep(NETWORK_RETRY_DELAY_MS);
        continue;
      }
      throw error;
    }
  }
  throw new Error("unreachable");
}

export async function apiFetch<T = void>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { auth = true, body, headers, method = "GET", ...rest } = options;

  const requestHeaders = new AxiosHeaders(headers);

  if (auth) {
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  const isIdempotent = ["GET", "HEAD"].includes(method.toUpperCase());

  try {
    const response = await fetchWithNetworkRetry(
      () =>
        axiosInstance.request<T>({
          ...rest,
          url: path,
          method,
          headers: requestHeaders,
          data: body !== undefined ? body : undefined,
        }),
      isIdempotent,
    );

    return response.data;
  } catch (error) {
    // Sessão expirada: limpa o cookie e redirecciona. Só faz sentido chamar
    // `redirect()` (que lança) aqui dentro do try/catch e relançar o erro.
    if (error instanceof ApiError && error.status === 401) {
      const store = await cookies();
      store.delete(SESSION_COOKIE);
      redirect("/login?expired=1");
    }
    throw error;
  }
}

export { ApiError };
