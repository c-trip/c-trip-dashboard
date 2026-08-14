import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/session";

// Este dashboard não tem "home" pública — serve só Gestor e Admin autenticados.
// A raiz decide para onde mandar cada um consoante o `role` de /auth/me.
export default async function RootPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  redirect(session.role === "admin" ? "/admin" : "/empresa");
}
