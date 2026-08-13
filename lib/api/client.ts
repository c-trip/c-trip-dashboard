import "server-only";
import { cookies } from "next/headers";

import { ApiError, parseApiError } from "@/lib/api/errors";
import { SESSION_COOKIE } from "@/lib/auth/constants";

const API_URL = process.env.API_URL ?? "http://localhost:8000";

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  /** Corpo do pedido — serializado como JSON automaticamente. */
  body?: unknown;
  /**
   * Envia `Authorization: Bearer <token>` a partir do cookie de sessão.
   * `false` só para os poucos endpoints públicos (login, registo, pesquisa de cidades...).
   * Omitir = `true`.
   */
  auth?: boolean;
};

/**
 * Cliente HTTP central para a API do C-Trip. `server-only`: nunca deve ser importado
 * por um Client Component (o token JWT nunca pode chegar ao browser em JS legível).
 *
 * Não faz `redirect()` sozinho em caso de 401 — quem decide o que fazer com uma sessão
 * inválida é a camada de autorização (`lib/auth/session.ts`), não este utilitário genérico.
 */
export async function apiFetch<T = void>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { auth = true, body, headers, ...init } = options;

  const requestHeaders = new Headers(headers);
  requestHeaders.set("Accept", "application/json");
  if (body !== undefined) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    // Dados privados e por-sessão — nunca guardar em cache partilhada entre utilizadores.
    cache: "no-store",
  });

  if (!response.ok) {
    throw await parseApiError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export { ApiError };
