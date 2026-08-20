import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { empresaNav } from "@/config/nav";
import { getPermissions, requireAuth } from "@/lib/auth/session";

export default async function EmpresaLayout({ children }: { children: ReactNode }) {
  const session = await requireAuth();

  // Este dashboard serve Gestor + Admin — um passageiro autenticado (ex.: por
  // engano) não deve ver o shell do painel da empresa.
  if (session.role === "passenger") {
    redirect("/sem-acesso");
  }

  const permissions = await getPermissions();
  const items = empresaNav.filter(
    (item) => !item.permission || session.role === "admin" || permissions.includes(item.permission)
  );

  return (
    <div className="flex min-h-svh">
      <Sidebar items={items} sectionLabel="Gestor" />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar session={session} title="Painel do Gestor" />
        {/*
          Banner de estado da empresa (pending/suspended) fica pronto a ligar assim
          que o backend expuser uma leitura do perfil — o guia só lista PATCH
          /companies/profile, sem GET. Ver components/dashboard/company-status-banner.tsx.
        */}
        <main className="flex-1 overflow-y-auto bg-muted/20 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
