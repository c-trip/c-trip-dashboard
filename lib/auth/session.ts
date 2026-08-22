import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getMe, getMyPermissions, type Me } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { SESSION_COOKIE } from "@/lib/auth/constants";

/**
 * Data Access Layer da sessão. Todo o resto da app (layouts, pages, Server Actions)
 * passa por aqui para saber "quem és" e "o que podes", nunca decide isso sozinho.
 * `cache()` garante que, dentro do mesmo pedido, o backend só é consultado uma vez
 * mesmo que vários componentes chamem `getSession()`/`can()` em paralelo.
 */

export type Session = Me;

export const getSessionToken = cache(async (): Promise<string | null> => {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
});

export const getSession = cache(async (): Promise<Session | null> => {
  const token = await getSessionToken();
  if (!token) return null;

  try {
    return await getMe();
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 404)) {
      return null;
    }
    throw error;
  }
});

export const getPermissions = cache(async (): Promise<string[]> => {
  const session = await getSession();
  if (!session) return [];

  try {
    const { permissions } = await getMyPermissions();
    return permissions;
  } catch (error) {
    if (error instanceof ApiError) return [];
    throw error;
  }
});

export async function can(code: string): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;
  if (session.role === "admin") return true;

  const permissions = await getPermissions();
  return permissions.includes(code);
}

export async function requireAuth(): Promise<Session> {
  const token = await getSessionToken();
  const session = await getSession();

  if (!session) {
    redirect(token ? "/login?expired=1" : "/login");
  }

  return session;
}

export async function requireRole(role: string): Promise<Session> {
  const session = await requireAuth();
  if (session.role !== role) {
    redirect("/sem-acesso");
  }
  return session;
}

export async function requirePermission(code: string): Promise<Session> {
  const session = await requireAuth();
  if (!(await can(code))) {
    redirect("/sem-acesso");
  }
  return session;
}
