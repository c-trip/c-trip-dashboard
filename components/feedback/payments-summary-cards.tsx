import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import type { PaymentsSummary } from "@/lib/api/types";
import { cn } from "@/lib/utils";

interface PaymentsSummaryCardsProps {
  summary: PaymentsSummary;
  className?: string;
}

const CARDS: Array<{
  label: string;
  total: keyof PaymentsSummary;
  count: keyof PaymentsSummary;
  accent: string;
}> = [
  { label: "Recebido", total: "total_confirmed", count: "count_confirmed", accent: "text-emerald-600 dark:text-emerald-400" },
  { label: "Pendente", total: "total_pending", count: "count_pending", accent: "text-amber-600 dark:text-amber-400" },
  { label: "Falhado", total: "total_failed", count: "count_failed", accent: "text-destructive" },
  { label: "Cancelado", total: "total_cancelled", count: "count_cancelled", accent: "text-muted-foreground" },
];

/**
 * Cartões de resumo financeiro, partilhados pelo painel do Admin
 * (`/admin/payments/summary`) e do Gestor (`/payments/company/summary`).
 */
export function PaymentsSummaryCards({ summary, className }: PaymentsSummaryCardsProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-4 lg:grid-cols-4", className)}>
      {CARDS.map((card) => {
        const total = summary[card.total] as number;
        const count = summary[card.count] as number;
        return (
          <Card key={card.label} className="gap-2 py-4">
            <CardHeader className="px-4">
              <CardDescription>{card.label}</CardDescription>
              <CardTitle className={cn("text-xl font-semibold tabular-nums", card.accent)}>
                {formatCurrency(total)}
              </CardTitle>
              <p className="text-xs text-muted-foreground tabular-nums">
                {count} {count === 1 ? "pagamento" : "pagamentos"}
              </p>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
