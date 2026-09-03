import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";

import { RouteRowActions } from "./route-row-actions";
import { ApiErrorState } from "@/components/feedback/api-error-state";
import { SimpleTable } from "@/components/tables/simple-table";
import { buttonVariants } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { getCompanyRoutes } from "@/lib/api/routes";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { can, requirePermission } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

export default async function RotasPage() {
  await requirePermission(PERMISSIONS.routeRead);
  const [canActivate, canDeactivate] = await Promise.all([
    can(PERMISSIONS.routeActivate),
    can(PERMISSIONS.routeDeactivate),
  ]);

  let routes;
  try {
    routes = await getCompanyRoutes();
  } catch (error) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Rotas
          </h2>
        </div>
        <ApiErrorState error={error} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Rotas
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ligações entre cidades que a tua empresa opera.
          </p>
        </div>
        <Link
          href="/empresa/rotas/nova"
          className={cn(buttonVariants({ variant: "default" }))}
        >
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
          {
            header: "Origem",
            cell: (r) => (
              <Link
                href={`/empresa/rotas/${r.id}`}
                className="font-medium text-primary hover:underline"
              >
                {r.origin_city}
              </Link>
            ),
          },
          {
            header: "Destino",
            cell: (r) => (
              <span className="font-medium">{r.destination_city}</span>
            ),
          },
          {
            header: "Preço base",
            cell: (r) => (
              <span className="tabular-nums font-medium">
                {formatCurrency(r.total_price)}
              </span>
            ),
          },
          {
            header: "Paragens",
            cell: (r) => (
              <span className="tabular-nums">
                {r.stops.length > 0 ? String(r.stops.length) : "—"}
              </span>
            ),
          },
          {
            header: "Estado",
            cell: (r) => (
              <span
                className={
                  r.is_active
                    ? "text-emerald-600 dark:text-emerald-400 font-medium"
                    : "text-muted-foreground"
                }
              >
                {r.is_active ? "Activa" : "Inactiva"}
              </span>
            ),
          },
          {
            header: "",
            cell: (r) => (
              <RouteRowActions
                routeId={r.id}
                routeLabel={`${r.origin_city} → ${r.destination_city}`}
                isActive={r.is_active}
                canActivate={canActivate}
                canDeactivate={canDeactivate}
              />
            ),
            className: "text-right",
          },
        ]}
      />
    </div>
  );
}
