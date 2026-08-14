import Link from "next/link";

import { empresaNav } from "@/config/nav";
import { NAV_ICONS } from "@/config/nav-icons";
import { requireAuth } from "@/lib/auth/session";

export default async function EmpresaOverviewPage() {
  const session = await requireAuth();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Olá, {session.name.split(" ")[0]}</h2>
        <p className="text-sm text-muted-foreground">Ponto de partida do painel do gestor.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {empresaNav.slice(1).map((item) => {
          const Icon = NAV_ICONS[item.icon];
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-muted/50"
            >
              <Icon size={18} className="text-muted-foreground" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
