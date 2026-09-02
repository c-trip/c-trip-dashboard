import Link from "next/link";

import { ConfirmPaymentButton } from "./confirm-payment-button";
import { SimpleTable } from "@/components/tables/simple-table";
import { StatusBadge } from "@/components/feedback/status-badge";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { getAllPayments } from "@/lib/api/admin";

const LIMIT = 50;

export default async function AdminPagamentosPage({
  searchParams,
}: PageProps<"/admin/pagamentos">) {
  const params = await searchParams;
  const offset = Number(params?.offset ?? 0) || 0;
  const payments = await getAllPayments(LIMIT, offset);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Pagamentos
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Todos os pagamentos da plataforma, do mais recente.
          </p>
        </div>
        <Link
          href="/admin/relatorios"
          className="text-sm text-primary hover:underline"
        >
          Fluxo de caixa e resumo
        </Link>
      </div>
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
