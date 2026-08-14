import type { ReactNode } from "react";

import { requireAuth } from "@/lib/auth/session";

// Guarda mínima, comum aos dois perfis — só confirma que há sessão válida.
// O chrome (sidebar/topbar) e o role exigido ficam em empresa/layout.tsx e
// admin/layout.tsx, porque a navegação de cada perfil é diferente.
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  await requireAuth();
  return <>{children}</>;
}
