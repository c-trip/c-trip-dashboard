import Link from "next/link";
import { notFound } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";

import { AddRouteStopForm } from "./add-stop-form";
import { CompanyBlocked } from "@/components/feedback/company-blocked";
import { SimpleTable } from "@/components/tables/simple-table";
import { getCities, getCompanyRoutes } from "@/lib/api/routes";
import { formatCurrency } from "@/lib/format";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { can, requirePermission } from "@/lib/auth/session";

export default async function RotaDetalhePage({ params }: PageProps<"/empresa/rotas/[routeId]">) {
  await requirePermission(PERMISSIONS.routeRead);
  const { routeId } = await params;
  const canAddStop = await can(PERMISSIONS.routeAddStop);

  let routes;
  try {
    routes = await getCompanyRoutes();
  } catch {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Rota</h2>
        </div>
        <CompanyBlocked />
      </div>
    );
  }

  const route = routes.find((item) => item.id === routeId);
  if (!route) notFound();

  const cities = canAddStop ? await getCities() : [];

  return (
    <div className="flex max-w-2xl flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <Link
          href="/empresa/rotas"
          className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <IconArrowLeft size={14} />
          Rotas
        </Link>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          {route.origin_city} → {route.destination_city}
        </h2>
        <p className="text-sm text-muted-foreground">
          {route.origin_province} · {route.destination_province} — preço base{" "}
          <span className="font-medium text-foreground">{formatCurrency(route.total_price)}</span> ·{" "}
          {route.is_active ? "Activa" : "Inactiva"}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-foreground">Paragens intermédias</h3>
        <SimpleTable
          rows={route.stops}
          rowKey={(stop) => stop.city}
          emptyTitle="Sem paragens intermédias"
          emptyDescription="Esta rota é directa entre origem e destino."
          columns={[
            { header: "Cidade", cell: (s) => <span className="font-medium">{s.city}</span> },
            {
              header: "Preço acumulado",
              cell: (s) => <span className="tabular-nums">{formatCurrency(s.price)}</span>,
              className: "text-right",
            },
          ]}
        />
      </div>

      {canAddStop ? (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-foreground">Adicionar paragem</h3>
          <AddRouteStopForm routeId={route.id} cities={cities} />
        </div>
      ) : null}
    </div>
  );
}
