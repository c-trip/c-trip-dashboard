import { CashFlowReport } from "@/components/dashboard/cash-flow-report";
import { ApiErrorState } from "@/components/feedback/api-error-state";
import { PageHeader } from "@/components/layout/page-header";
import { PaymentsFilterBar } from "@/components/feedback/payments-filter-bar";
import { PaymentsSummaryCards } from "@/components/feedback/payments-summary-cards";
import { getCompanyPaymentsSummary } from "@/lib/api/payments";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";

function str(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function RelatoriosPage({
  searchParams,
}: PageProps<"/empresa/relatorios">) {
  await requirePermission(PERMISSIONS.financeReportDaily);

  const params = await searchParams;
  const filters = {
    date_from: str(params?.date_from),
    date_to: str(params?.date_to),
    method: str(params?.method),
  };

  let summary;
  try {
    summary = await getCompanyPaymentsSummary(filters);
  } catch (error) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <PageHeader context="Finanças" title="Fluxo de caixa" />
        <ApiErrorState error={error} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <PageHeader
        context="Finanças"
        title="Fluxo de caixa"
        description="Entradas confirmadas por dia e por mês, e o resumo financeiro das rotas da tua empresa."
        actions={<PaymentsFilterBar initial={filters} />}
      />
      <PaymentsSummaryCards summary={summary} />
      <CashFlowReport byDay={summary.by_day} byMonth={summary.by_month} />
    </div>
  );
}
