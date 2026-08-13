import { SimpleTable } from "@/components/tables/simple-table";
import { formatDateTime } from "@/lib/format";
import { getAuditLog } from "@/lib/api/admin";

export default async function AuditoriaPage() {
  const entries = await getAuditLog();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Auditoria</h2>
        <p className="text-sm text-muted-foreground">Últimos 50 eventos — o backend ainda não pagina este endpoint.</p>
      </div>
      <SimpleTable
        rows={entries}
        rowKey={(entry) => entry.id}
        emptyTitle="Sem eventos registados"
        columns={[
          { header: "Evento", cell: (e) => e.event_type },
          { header: "Descrição", cell: (e) => e.description },
          { header: "Quando", cell: (e) => formatDateTime(e.occurred_at) },
        ]}
      />
    </div>
  );
}
