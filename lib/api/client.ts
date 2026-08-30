import "server-only";
import { cookies } from "next/headers";

import { ApiError, parseApiError } from "@/lib/api/errors";
import { SESSION_COOKIE } from "@/lib/auth/constants";
import { API_URL } from "@/constants/api_base";

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

const NETWORK_RETRY_ATTEMPTS = 2;
const NETWORK_RETRY_DELAY_MS = 200;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithNetworkRetry(
  url: string,
  init: RequestInit,
  retryable: boolean,
): Promise<Response> {
  const attempts = retryable ? NETWORK_RETRY_ATTEMPTS : 1;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fetch(url, init);
    } catch (error) {
      if (attempt === attempts) throw error;
      await sleep(NETWORK_RETRY_DELAY_MS);
    }
  }

  throw new Error("unreachable");
}

export async function apiFetch<T = void>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { auth = true, body, headers, ...init } = options;

  console.log("API_URL =", API_URL);
  console.log("PATH =", path);
  console.log("FINAL URL =", `${API_URL}${path}`);

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

  const method = (init.method ?? "GET").toString().toUpperCase();
  const isIdempotent = method === "GET" || method === "HEAD";

  const response = await fetchWithNetworkRetry(
    `${API_URL}${path}`,
    {
      ...init,
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    },
    isIdempotent,
  );

  if (!response.ok) {
    console.log("ERROR STATUS:", response.status);
    console.log("ERROR TEXT:", await response.text());
    throw await parseApiError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  console.log("STATUS:", response.status);
  console.log("OK:", response.ok);

  return (await response.json()) as T;
}

export { ApiError };
