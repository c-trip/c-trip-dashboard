import { CashFlowReport } from "@/components/dashboard/cash-flow-report";
import { PaymentsFilterBar } from "@/components/feedback/payments-filter-bar";
import { PaymentsSummaryCards } from "@/components/feedback/payments-summary-cards";
import { getAdminPaymentsSummary } from "@/lib/api/admin";

function str(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminRelatoriosPage({
  searchParams,
}: PageProps<"/admin/relatorios">) {
  const params = await searchParams;
  const filters = {
    date_from: str(params?.date_from),
    date_to: str(params?.date_to),
    method: str(params?.method),
  };

  const summary = await getAdminPaymentsSummary(filters);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Relatórios
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Fluxo de caixa e resumo financeiro global da plataforma.
        </p>
      </div>
      <PaymentsFilterBar initial={filters} />
      <PaymentsSummaryCards summary={summary} />
      <CashFlowReport byDay={summary.by_day} byMonth={summary.by_month} />
    </div>
  );
}
