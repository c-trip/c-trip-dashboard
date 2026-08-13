import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";

import { SimpleTable } from "@/components/tables/simple-table";
import { buttonVariants } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { getCompanyRoutes } from "@/lib/api/routes";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

export default async function RotasPage() {
  await requirePermission(PERMISSIONS.routeRead);
  const routes = await getCompanyRoutes();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Rotas</h2>
          <p className="text-sm text-muted-foreground">Ligações entre cidades que a tua empresa opera.</p>
        </div>
        <Link href="/empresa/rotas/nova" className={cn(buttonVariants({ variant: "default" }))}>
          <IconPlus size={16} data-icon="inline-start" />
          Nova rota
        </Link>
      </div>
      <SimpleTable
        rows={routes}
        rowKey={(route) => route.id}
        emptyTitle="Ainda não há rotas"
        emptyDescription="Cria a tua primeira rota para poderes agendar horários e vender bilhetes."
        columns={[
          { header: "Origem", cell: (r) => `${r.origin_city} · ${r.origin_province}` },
          { header: "Destino", cell: (r) => `${r.destination_city} · ${r.destination_province}` },
          { header: "Preço base", cell: (r) => formatCurrency(r.total_price) },
          { header: "Paragens", cell: (r) => (r.stops.length > 0 ? String(r.stops.length) : "—") },
          {
            header: "Estado",
            cell: (r) => (
              <span className={r.is_active ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}>
                {r.is_active ? "Activa" : "Inactiva"}
              </span>
            ),
          },
        ]}
      />
    </div>
  );
}
