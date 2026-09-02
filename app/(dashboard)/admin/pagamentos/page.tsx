import { ConfirmPaymentButton } from "./confirm-payment-button";
import { PaymentsSummaryCards } from "@/components/feedback/payments-summary-cards";
import { SimpleTable } from "@/components/tables/simple-table";
import { StatusBadge } from "@/components/feedback/status-badge";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { getAdminPaymentsSummary, getAllPayments } from "@/lib/api/admin";

const LIMIT = 50;

export default async function AdminPagamentosPage({ searchParams }: PageProps<"/admin/pagamentos">) {
  const params = await searchParams;
  const offset = Number(params?.offset ?? 0) || 0;
  const [payments, summary] = await Promise.all([
    getAllPayments(LIMIT, offset),
    getAdminPaymentsSummary(),
  ]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Pagamentos</h2>
        <p className="mt-1 text-sm text-muted-foreground">Visão financeira global da plataforma.</p>
      </div>
      <PaymentsSummaryCards summary={summary} />
      <SimpleTable
        rows={payments}
        rowKey={(payment) => payment.payment_id}
        emptyTitle="Nenhum pagamento nesta página"
        columns={[
          { header: "Valor", cell: (p) => <span className="font-medium tabular-nums">{formatCurrency(p.amount)}</span> },
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
