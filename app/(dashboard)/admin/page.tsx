import Link from "next/link";

import { adminNav } from "@/config/nav";
import { NAV_ICONS } from "@/config/nav-icons";
import { getPendingCompanies } from "@/lib/api/admin";
import { requireRole } from "@/lib/auth/session";

export default async function AdminOverviewPage() {
  const session = await requireRole("admin");
  const pending = await getPendingCompanies();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Olá, {session.name.split(" ")[0]}</h2>
        <p className="text-sm text-muted-foreground">
          {pending.length > 0
            ? `${pending.length} empresa(s) à espera de aprovação.`
            : "Não há empresas pendentes neste momento."}
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {adminNav.slice(1).map((item) => {
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
