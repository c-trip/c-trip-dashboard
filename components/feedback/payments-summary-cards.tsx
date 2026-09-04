import { MetricStrip, type Metric } from "@/components/dashboard/metric-strip";
import { formatCurrency } from "@/lib/format";
import type { PaymentsSummary } from "@/lib/api/types";

const ROWS: Array<{
  label: string;
  total: keyof PaymentsSummary;
  count: keyof PaymentsSummary;
  accent: Metric["accent"];
}> = [
  {
    label: "Recebido",
    total: "total_confirmed",
    count: "count_confirmed",
    accent: "positive",
  },
  {
    label: "Pendente",
    total: "total_pending",
    count: "count_pending",
    accent: "warning",
  },
  {
    label: "Falhado",
    total: "total_failed",
    count: "count_failed",
    accent: "negative",
  },
  {
    label: "Cancelado",
    total: "total_cancelled",
    count: "count_cancelled",
    accent: "default",
  },
];

/**
 * Resumo financeiro (recebido / pendente / falhado / cancelado), partilhado pelo
 * painel do Admin e do Gestor.
 */
export function PaymentsSummaryCards({
  summary,
}: {
  summary: PaymentsSummary;
}) {
  const metrics: Metric[] = ROWS.map((row) => {
    const count = summary[row.count] as number;
    return {
      label: row.label,
      value: formatCurrency(summary[row.total] as number),
      hint: `${count} ${count === 1 ? "pagamento" : "pagamentos"}`,
      accent: row.accent,
    };
  });
  return <MetricStrip metrics={metrics} />;
}
