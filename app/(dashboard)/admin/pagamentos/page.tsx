import { ConfirmPaymentButton } from "./confirm-payment-button";
import { SimpleTable } from "@/components/tables/simple-table";
import { StatusBadge } from "@/components/feedback/status-badge";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { getAllPayments } from "@/lib/api/admin";

const LIMIT = 50;

export default async function AdminPagamentosPage({ searchParams }: PageProps<"/admin/pagamentos">) {
  const params = await searchParams;
  const offset = Number(params?.offset ?? 0) || 0;
  const payments = await getAllPayments(LIMIT, offset);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Pagamentos</h2>
        <p className="text-sm text-muted-foreground">Visão financeira global da plataforma.</p>
      </div>
      <SimpleTable
        rows={payments}
        rowKey={(payment) => payment.payment_id}
        emptyTitle="Nenhum pagamento nesta página"
        columns={[
          { header: "Valor", cell: (p) => formatCurrency(p.amount) },
          { header: "Método", cell: (p) => p.method },
          { header: "Estado", cell: (p) => <StatusBadge domain="payment" status={p.status} /> },
          { header: "Criado em", cell: (p) => formatDateTime(p.created_at) },
          {
            header: "",
            cell: (p) => (p.status === "pending" ? <ConfirmPaymentButton paymentId={p.payment_id} /> : null),
            className: "text-right",
          },
        ]}
      />
    </div>
  );
}
