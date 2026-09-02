import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";

import { BusRowActions } from "./bus-row-actions";
import { CompanyBlocked } from "@/components/feedback/company-blocked";
import { SimpleTable } from "@/components/tables/simple-table";
import { StatusBadge } from "@/components/feedback/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { getBuses } from "@/lib/api/fleet";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { can, requirePermission } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

export default async function AutocarrosPage() {
  await requirePermission(PERMISSIONS.busRead);
  const canCreate = await can(PERMISSIONS.busCreate);

  let buses;
  try {
    buses = await getBuses();
  } catch {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Autocarros</h2>
        </div>
        <CompanyBlocked />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Autocarros</h2>
          <p className="mt-1 text-sm text-muted-foreground">Frota cadastrada pela empresa.</p>
        </div>
        {canCreate ? (
          <Link
            href="/empresa/frota/autocarros/nova"
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <IconPlus size={16} data-icon="inline-start" />
            Adicionar autocarro
          </Link>
        ) : null}
      </div>
      <SimpleTable
        rows={buses}
        rowKey={(bus) => bus.id}
        emptyTitle="Ainda não há autocarros"
        emptyDescription="Cadastra o primeiro autocarro para começar a agendar viagens."
        columns={[
          { header: "Modelo", cell: (b) => <span className="font-medium">{b.model}</span> },
          { header: "Matrícula", cell: (b) => <span className="font-mono text-xs">{b.plate}</span> },
          { header: "Lugares", cell: (b) => <span className="tabular-nums">{String(b.seats)}</span> },
          { header: "Estado", cell: (b) => <StatusBadge domain="bus" status={b.status} /> },
          {
            header: "",
            cell: (b) => <BusRowActions busId={b.id} currentStatus={b.status} />,
            className: "text-right",
          },
        ]}
      />
    </div>
  );
}
