import Link from "next/link";
import {
  IconRoute,
  IconCalendar,
  IconBus,
  IconUsers,
  IconUserCog,
  IconCreditCard,
  IconLayoutDashboard,
} from "@tabler/icons-react";

import { empresaNav } from "@/config/nav";
import { requireAuth } from "@/lib/auth/session";

const NAV_ICONS_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  route: IconRoute,
  calendar: IconCalendar,
  bus: IconBus,
  users: IconUsers,
  userCog: IconUserCog,
  creditCard: IconCreditCard,
  dashboard: IconLayoutDashboard,
};

const NAV_COLORS: Record<string, string> = {
  route: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  calendar: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  bus: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  users: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  userCog: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  creditCard: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
};

export default async function EmpresaOverviewPage() {
  const session = await requireAuth();

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-balance text-foreground">
          Olá, {session.name.split(" ")[0]}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ponto de partida do painel do gestor. Gere rotas, frota e pagamentos da tua empresa.
        </p>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Secções</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {empresaNav.slice(1).map((item) => {
            const Icon = NAV_ICONS_MAP[item.icon];
            const colorClass = NAV_COLORS[item.icon] ?? "bg-muted text-muted-foreground";
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-xs transition-all duration-200 hover:shadow-md hover:border-primary/20"
              >
                <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110 ${colorClass}`}>
                  {Icon ? <Icon size={20} /> : null}
                </div>
                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-200">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
