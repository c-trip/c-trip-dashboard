import { CashFlowReport } from "@/components/dashboard/cash-flow-report";
import { CompanyBlocked } from "@/components/feedback/company-blocked";
import { PaymentsFilterBar } from "@/components/feedback/payments-filter-bar";
import { PaymentsSummaryCards } from "@/components/feedback/payments-summary-cards";
import { SimpleTable } from "@/components/tables/simple-table";
import { StatusBadge } from "@/components/feedback/status-badge";
import { formatCurrency, formatDateTime } from "@/lib/format";
import {
  getCompanyPayments,
  getCompanyPaymentsSummary,
} from "@/lib/api/payments";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";

function str(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PagamentosPage({
  searchParams,
}: PageProps<"/empresa/pagamentos">) {
  await requirePermission(PERMISSIONS.paymentReadCompany);

  const params = await searchParams;
  const filters = {
    date_from: str(params?.date_from),
    date_to: str(params?.date_to),
    method: str(params?.method),
  };

  let payments;
  let summary;
  try {
    [payments, summary] = await Promise.all([
      getCompanyPayments(),
      getCompanyPaymentsSummary(filters),
    ]);
  } catch {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Pagamentos
          </h2>
        </div>
        <CompanyBlocked />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Pagamentos
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pagamentos das reservas ligadas às rotas da tua empresa.
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
        emptyTitle="Ainda não há pagamentos"
        emptyDescription="Os pagamentos aparecem aqui assim que forem processados pelo gateway."
        columns={[
          {
            header: "Reserva",
            cell: (p) => (
              <span className="font-mono text-xs">
                {p.booking_id.slice(0, 8)}
              </span>
            ),
          },
          {
            header: "Valor",
            cell: (p) => (
              <span className="tabular-nums font-medium">
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
        ]}
      />
    </div>
  );
}
