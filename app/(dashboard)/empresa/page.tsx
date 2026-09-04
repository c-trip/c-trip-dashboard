import Link from "next/link";
import { unstable_rethrow } from "next/navigation";

import { ApiErrorState } from "@/components/feedback/api-error-state";
import { MetricStrip, type Metric } from "@/components/dashboard/metric-strip";
import { PageHeader } from "@/components/layout/page-header";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { SimpleTable } from "@/components/tables/simple-table";
import { StatusBadge } from "@/components/feedback/status-badge";
import { getCompanyPaymentsSummary } from "@/lib/api/payments";
import { getCompanyRoutes } from "@/lib/api/routes";
import { getCompanySchedules } from "@/lib/api/schedules";
import { formatCurrency } from "@/lib/format";
import { requireAuth } from "@/lib/auth/session";

export default async function EmpresaOverviewPage() {
  await requireAuth();

  // Cada bloco é independente: um 403 por falta de permissão (colaborador limitado)
  // não deve esconder o resto do painel. Guardamos o 1.º erro para o caso de
  // tudo falhar — `unstable_rethrow` deixa passar redirects do Next.
  let firstError: unknown;
  async function safe<T>(promise: Promise<T>): Promise<T | null> {
    try {
      return await promise;
    } catch (error) {
      unstable_rethrow(error);
      firstError ??= error;
      return null;
    }
  }

  const [routes, schedules, summary] = await Promise.all([
    safe(getCompanyRoutes()),
    safe(getCompanySchedules()),
    safe(getCompanyPaymentsSummary()),
  ]);

  if (!routes && !schedules && !summary) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <PageHeader context="Empresa" title="Visão geral" />
        <ApiErrorState error={firstError} />
      </div>
    );
  }

  const scheduledTrips = (schedules ?? []).filter(
    (trip) => trip.status === "scheduled",
  );
  const activeRoutes = (routes ?? []).filter((route) => route.is_active).length;
  const upcoming = [...scheduledTrips]
    .sort((a, b) =>
      `${a.departure_date}T${a.departure_time}`.localeCompare(
        `${b.departure_date}T${b.departure_time}`,
      ),
    )
    .slice(0, 5);

  const metrics: Metric[] = [];
  if (summary) {
    metrics.push(
      {
        label: "Receita confirmada",
        value: formatCurrency(summary.total_confirmed),
        hint: `${summary.count_confirmed} pagamento(s)`,
        accent: "positive",
        href: "/empresa/pagamentos",
      },
      {
        label: "A aguardar confirmação",
        value: formatCurrency(summary.total_pending),
        hint: `${summary.count_pending} pagamento(s)`,
        accent: "warning",
      },
    );
  }
  if (routes) {
    metrics.push({
      label: "Rotas activas",
      value: activeRoutes,
      hint: `${routes.length} no total`,
      href: "/empresa/rotas",
    });
  }
  if (schedules) {
    metrics.push({
      label: "Viagens agendadas",
      value: scheduledTrips.length,
      href: "/empresa/horarios",
    });
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <PageHeader context="Empresa" title="Visão geral" />
      {metrics.length > 0 ? <MetricStrip metrics={metrics} /> : null}
      {summary ? <RevenueChart byMonth={summary.by_month} /> : null}
      {schedules ? (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-foreground">
            Próximas viagens
          </h3>
          <SimpleTable
            rows={upcoming}
            rowKey={(trip) => trip.schedule_id}
            emptyTitle="Sem viagens agendadas"
            emptyDescription="Agenda uma viagem em Horários para a veres aqui."
            columns={[
              {
                header: "Rota",
                cell: (t) => (
                  <span className="font-medium">
                    {t.origin} → {t.destination}
                  </span>
                ),
              },
              {
                header: "Partida",
                cell: (t) => `${t.departure_date} · ${t.departure_time}`,
              },
              {
                header: "Lugares",
                cell: (t) => (
                  <span className="tabular-nums">{`${t.available_seats}/${t.total_seats} livres`}</span>
                ),
              },
              {
                header: "Estado",
                cell: (t) => (
                  <StatusBadge domain="schedule" status={t.status} />
                ),
              },
              {
                header: "",
                cell: (t) => (
                  <Link
                    href={`/empresa/horarios/${t.schedule_id}`}
                    className="text-primary hover:underline"
                  >
                    Abrir
                  </Link>
                ),
                className: "text-right",
              },
            ]}
          />
        </div>
      ) : null}
    </div>
  );
}
