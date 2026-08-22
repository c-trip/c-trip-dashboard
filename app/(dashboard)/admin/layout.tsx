import type { CSSProperties, ReactNode } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { adminNav } from "@/config/nav";
import { requireRole } from "@/lib/auth/session";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireRole("admin");

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties
      }
    >
      <AppSidebar variant="inset" items={adminNav} sectionLabel="Admin" session={session} />
      <SidebarInset>
        <SiteHeader title="Administração da Plataforma" />
        <div className="flex-1 overflow-y-auto bg-muted/20 p-4 md:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
