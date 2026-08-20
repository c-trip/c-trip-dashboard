import type { ReactNode } from "react";

import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { adminNav } from "@/config/nav";
import { requireRole } from "@/lib/auth/session";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // role==="admin" já é bypass total das permissões (ver lib/auth/session.ts),
  // por isso a nav do admin não precisa de ser filtrada como a do Gestor.
  const session = await requireRole("admin");

  return (
    <div className="flex min-h-svh">
      <Sidebar items={adminNav} sectionLabel="Admin" />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar session={session} title="Administração da Plataforma" />
        <main className="flex-1 overflow-y-auto bg-muted/20 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
