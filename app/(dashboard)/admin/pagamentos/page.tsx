import { ConfirmPaymentButton } from "./confirm-payment-button";
import { CashFlowReport } from "@/components/dashboard/cash-flow-report";
import { PaymentsFilterBar } from "@/components/feedback/payments-filter-bar";
import { PaymentsSummaryCards } from "@/components/feedback/payments-summary-cards";
import { SimpleTable } from "@/components/tables/simple-table";
import { StatusBadge } from "@/components/feedback/status-badge";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { getAdminPaymentsSummary, getAllPayments } from "@/lib/api/admin";

const LIMIT = 50;

function str(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminPagamentosPage({
  searchParams,
}: PageProps<"/admin/pagamentos">) {
  const params = await searchParams;
  const offset = Number(params?.offset ?? 0) || 0;
  const filters = {
    date_from: str(params?.date_from),
    date_to: str(params?.date_to),
    method: str(params?.method),
  };
  const [payments, summary] = await Promise.all([
    getAllPayments(LIMIT, offset),
    getAdminPaymentsSummary(filters),
  ]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Pagamentos
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Visão financeira global da plataforma.
        </p>
      </div>
      <PaymentsFilterBar initial={filters} />
      <PaymentsSummaryCards summary={summary} />
      <CashFlowReport byDay={summary.by_day} byMonth={summary.by_month} />
      <p className="-mb-2 text-xs text-muted-foreground">
        Os filtros acima afectam apenas o resumo. A lista abaixo mostra os
        pagamentos mais recentes.
      </p>
      <SimpleTable
        rows={payments}
        rowKey={(payment) => payment.payment_id}
        emptyTitle="Nenhum pagamento nesta página"
        columns={[
          {
            header: "Valor",
            cell: (p) => (
              <span className="font-medium tabular-nums">
                {formatCurrency(p.amount)}
              </span>
            ),
          },
          { header: "Método", cell: (p) => p.method },
          {
            header: "Estado",
            cell: (p) => <StatusBadge domain="payment" status={p.status} />,
          },
          { header: "Criado em", cell: (p) => formatDateTime(p.created_at) },
          {
            header: "",
            cell: (p) =>
              p.status === "pending" ? (
                <ConfirmPaymentButton paymentId={p.payment_id} />
              ) : null,
            className: "text-right",
          },
        ]}
      />
    </div>
  );
}
