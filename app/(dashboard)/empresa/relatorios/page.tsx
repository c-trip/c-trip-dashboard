import { CashFlowReport } from "@/components/dashboard/cash-flow-report";
import { CompanyBlocked } from "@/components/feedback/company-blocked";
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
  await requirePermission(PERMISSIONS.paymentReadCompany);

  const params = await searchParams;
  const filters = {
    date_from: str(params?.date_from),
    date_to: str(params?.date_to),
    method: str(params?.method),
  };

  let summary;
  try {
    summary = await getCompanyPaymentsSummary(filters);
  } catch {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Fluxo de caixa
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
          Fluxo de caixa
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Entradas confirmadas por dia e por mês, e o resumo financeiro das
          rotas da tua empresa.
        </p>
      </div>
      <PaymentsFilterBar initial={filters} />
      <PaymentsSummaryCards summary={summary} />
      <CashFlowReport byDay={summary.by_day} byMonth={summary.by_month} />
    </div>
  );
}
