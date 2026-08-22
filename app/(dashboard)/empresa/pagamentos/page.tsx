import { CompanyBlocked } from "@/components/feedback/company-blocked";
import { SimpleTable } from "@/components/tables/simple-table";
import { StatusBadge } from "@/components/feedback/status-badge";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { getCompanyPayments } from "@/lib/api/payments";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";

export default async function PagamentosPage() {
  await requirePermission(PERMISSIONS.paymentReadCompany);

  let payments;
  try {
    payments = await getCompanyPayments();
  } catch {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Pagamentos</h2>
        </div>
        <CompanyBlocked />
      </div>
    );
  }

  const totalConfirmed = payments
    .filter((payment) => payment.status === "confirmed")
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Pagamentos</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {payments.length} pagamento(s) · {formatCurrency(totalConfirmed)} confirmados
        </p>
      </div>
      <SimpleTable
        rows={payments}
        rowKey={(payment) => payment.payment_id}
        emptyTitle="Ainda não há pagamentos"
        emptyDescription="Os pagamentos aparecem aqui assim que forem processados pelo gateway."
        columns={[
          { header: "Reserva", cell: (p) => <span className="font-mono text-xs">{p.booking_id.slice(0, 8)}</span> },
          { header: "Valor", cell: (p) => <span className="tabular-nums font-medium">{formatCurrency(p.amount)}</span> },
          { header: "Método", cell: (p) => p.method },
          { header: "Estado", cell: (p) => <StatusBadge domain="payment" status={p.status} /> },
          { header: "Criado em", cell: (p) => formatDateTime(p.created_at) },
        ]}
      />
    </div>
  );
}
