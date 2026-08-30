import "server-only";

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
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        return Promise.reject(parseApiError(axiosError.response));
      }
      // Erro de rede / timeout — sem resposta do servidor.
      return Promise.reject(
        new ApiError(
          0,
          axiosError.code === "ECONNABORTED"
            ? "A ligação ao servidor demorou demasiado. Tenta novamente."
            : "Não foi possível ligar ao servidor. Verifica a tua ligação.",
        ),
      );
    }
    return Promise.reject(error);
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
      // Só retenta em falhas de rede (sem resposta HTTP), não em erros de negócio.
      if (!axios.isAxiosError(error) || !(error as AxiosError).response) {
        if (attempt === attempts) throw error;
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
