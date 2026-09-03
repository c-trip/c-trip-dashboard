import Link from "next/link";

import { ApiErrorState } from "@/components/feedback/api-error-state";
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
  } catch (error) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Pagamentos
          </h2>
        </div>
        <ApiErrorState error={error} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Pagamentos
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pagamentos das reservas ligadas às rotas da tua empresa.
          </p>
        </div>
        <Link
          href="/empresa/relatorios"
          className="text-sm text-primary hover:underline"
        >
          Ver fluxo de caixa
        </Link>
      </div>
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
