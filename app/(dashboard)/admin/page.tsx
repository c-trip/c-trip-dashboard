import Link from "next/link";
import { IconBuilding, IconUsers, IconCreditCard, IconClipboard, IconShield, IconClock } from "@tabler/icons-react";

import { adminNav } from "@/config/nav";
import { getPendingCompanies } from "@/lib/api/admin";
import { requireRole } from "@/lib/auth/session";

const NAV_ICONS_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  building: IconBuilding,
  users: IconUsers,
  creditCard: IconCreditCard,
  clipboard: IconClipboard,
  shield: IconShield,
};

const NAV_COLORS: Record<string, string> = {
  building: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  users: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  creditCard: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  clipboard: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  shield: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

export default async function AdminOverviewPage() {
  const session = await requireRole("admin");
  const pending = await getPendingCompanies();

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-balance text-foreground">
          Olá, {session.name.split(" ")[0]}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Visão geral da plataforma C-Trip. Podes gerir empresas, utilizadores e pagamentos a partir daqui.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10">
              <IconClock size={20} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums text-foreground">{pending.length}</p>
              <p className="text-xs font-medium text-muted-foreground">
                {pending.length === 1 ? "empresa pendente" : "empresas pendentes"}
              </p>
            </div>
          </div>
          {pending.length > 0 ? (
            <Link
              href="/admin/empresas?tab=pending"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Revisar agora
            </Link>
          ) : null}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Secções</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {adminNav.slice(1).map((item) => {
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
