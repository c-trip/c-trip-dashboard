import { SimpleTable } from "@/components/tables/simple-table";
import { StatusBadge } from "@/components/feedback/status-badge";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { getCompanyPayments } from "@/lib/api/payments";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";

export default async function PagamentosPage() {
  await requirePermission(PERMISSIONS.paymentReadCompany);
  const payments = await getCompanyPayments();
  // A API não devolve totais prontos — soma-se aqui, a partir da lista.
  const totalConfirmed = payments
    .filter((payment) => payment.status === "confirmed")
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Pagamentos</h2>
        <p className="text-sm text-muted-foreground">
          {payments.length} pagamento(s) · {formatCurrency(totalConfirmed)} confirmados
        </p>
      </div>
      <SimpleTable
        rows={payments}
        rowKey={(payment) => payment.payment_id}
        emptyTitle="Ainda não há pagamentos"
        columns={[
          { header: "Reserva", cell: (p) => p.booking_id.slice(0, 8) },
          { header: "Valor", cell: (p) => formatCurrency(p.amount) },
          { header: "Método", cell: (p) => p.method },
          { header: "Estado", cell: (p) => <StatusBadge domain="payment" status={p.status} /> },
          { header: "Criado em", cell: (p) => formatDateTime(p.created_at) },
        ]}
      />
    </div>
  );
}
