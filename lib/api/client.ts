import "server-only";
import { cookies } from "next/headers";

import { ApiError, parseApiError } from "@/lib/api/errors";
import { SESSION_COOKIE } from "@/lib/auth/constants";
import { API_URL } from "@/constants/base-url";

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
};

export async function apiFetch<T = void>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
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
