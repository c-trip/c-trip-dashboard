import { SimpleTable } from "@/components/tables/simple-table";
import { StatusBadge } from "@/components/feedback/status-badge";
import { getBuses } from "@/lib/api/fleet";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";

export default async function AutocarrosPage() {
  await requirePermission(PERMISSIONS.busRead);
  const buses = await getBuses();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Autocarros</h2>
        <p className="text-sm text-muted-foreground">Frota cadastrada pela empresa.</p>
      </div>
      <SimpleTable
        rows={buses}
        rowKey={(bus) => bus.id}
        emptyTitle="Ainda não há autocarros"
        columns={[
          { header: "Modelo", cell: (b) => b.model },
          { header: "Matrícula", cell: (b) => b.plate },
          { header: "Lugares", cell: (b) => String(b.seats) },
          { header: "Estado", cell: (b) => <StatusBadge domain="bus" status={b.status} /> },
        ]}
      />
    </div>
  );
}
