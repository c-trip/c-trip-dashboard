import type { CSSProperties, ReactNode } from "react";
import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { empresaNav } from "@/config/nav";
import { getPermissions, requireAuth } from "@/lib/auth/session";

export default async function EmpresaLayout({ children }: { children: ReactNode }) {
  const session = await requireAuth();

  if (session.role === "passenger") {
    redirect("/sem-acesso");
  }

  const permissions = await getPermissions();
  const items = empresaNav.filter(
    (item) => !item.permission || session.role === "admin" || permissions.includes(item.permission)
  );

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties
      }
    >
      <AppSidebar variant="inset" items={items} sectionLabel="Gestor" session={session} />
      <SidebarInset>
        <SiteHeader title="Painel do Gestor" />
        <div className="flex-1 overflow-y-auto bg-muted/20 p-4 md:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
