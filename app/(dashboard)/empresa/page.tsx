import Link from "next/link";
import { unstable_rethrow } from "next/navigation";

import { ApiErrorState } from "@/components/feedback/api-error-state";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { SectionCards, type SectionCardItem } from "@/components/section-cards";
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
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Visão geral
          </h2>
        </div>
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

  const cards: SectionCardItem[] = [];
  if (summary) {
    cards.push(
      {
        description: "Receita confirmada",
        value: formatCurrency(summary.total_confirmed),
        footerTitle: `${summary.count_confirmed} pagamento(s) confirmado(s)`,
        footerSubtitle: "Ver pagamentos",
        footerHref: "/empresa/pagamentos",
      },
      {
        description: "A aguardar confirmação",
        value: formatCurrency(summary.total_pending),
        footerTitle: `${summary.count_pending} pagamento(s) pendente(s)`,
        footerSubtitle: "Processados pelo gateway",
      },
    );
  }
  if (routes) {
    cards.push({
      description: "Rotas activas",
      value: String(activeRoutes),
      footerTitle:
        activeRoutes === routes.length
          ? "Todas as rotas activas"
          : `${routes.length} no total`,
      footerSubtitle: "Gerir rotas",
      footerHref: "/empresa/rotas",
    });
  }
  if (schedules) {
    cards.push({
      description: "Viagens agendadas",
      value: String(scheduledTrips.length),
      footerTitle:
        scheduledTrips.length > 0
          ? "Com partida prevista"
          : "Nenhuma viagem agendada",
      footerSubtitle: "Ver horários",
      footerHref: "/empresa/horarios",
    });
  }

  return (
    <div className="@container/main -mx-4 flex flex-1 flex-col gap-4 md:-mx-8 md:gap-6 animate-fade-in">
      {cards.length > 0 ? <SectionCards cards={cards} /> : null}
      {summary ? (
        <div className="px-4 lg:px-6">
          <RevenueChart byMonth={summary.by_month} />
        </div>
      ) : null}
      {schedules ? (
        <div className="flex flex-col gap-3 px-4 lg:px-6">
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
