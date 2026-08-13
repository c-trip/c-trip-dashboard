import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SESSION_COOKIE } from "@/lib/auth/constants";

// No Next.js 16 o antigo `middleware.ts` chama-se `proxy.ts` (ver AGENTS.md deste
// projecto). Este proxy faz só a checagem OPTIMISTA de sessão — existe cookie? —
// para redireccionar cedo e evitar mostrar o shell do dashboard a um deslogado.
//
// A autorização real (permissões, role) fica sempre em lib/auth/session.ts,
// verificada de novo em cada layout/Server Action: a própria documentação do
// Next.js avisa que Server Actions podem contornar o `matcher` do proxy.

const PUBLIC_ROUTES = ["/login", "/registo-empresa"];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  if (!hasSession && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (hasSession && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)"],
};
