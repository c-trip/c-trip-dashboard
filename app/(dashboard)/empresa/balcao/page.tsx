import { unstable_rethrow } from "next/navigation";

import {
  BalcaoTripList,
  type BalcaoTrip,
} from "@/components/operator/balcao-trip-list";
import { ApiErrorState } from "@/components/feedback/api-error-state";
import { MetricStrip, type Metric } from "@/components/dashboard/metric-strip";
import { PageHeader } from "@/components/layout/page-header";
import { getOperatorSchedules } from "@/lib/api/operator";
import { getCompanyPaymentsSummary } from "@/lib/api/payments";
import { getCompanyRoutes } from "@/lib/api/routes";
import { formatCurrency } from "@/lib/format";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";

function str(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function ymd(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    unstable_rethrow(error);
    return fallback;
  }
}

export default async function BalcaoPage({
  searchParams,
}: PageProps<"/empresa/balcao">) {
  await requirePermission(PERMISSIONS.bookingSell);
  const date = str((await searchParams)?.date);
  const today = ymd(new Date());

  let schedules;
  try {
    schedules = await getOperatorSchedules(date);
  } catch (error) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <PageHeader context="Operação" title="Balcão" />
        <ApiErrorState error={error} />
      </div>
    );
  }

  const [routes, todaySummary] = await Promise.all([
    safe(getCompanyRoutes(), []),
    safe(getCompanyPaymentsSummary({ date_from: today, date_to: today }), null),
  ]);

  const priceByRoute = new Map(
    routes.map((route) => [
      `${route.origin_city}→${route.destination_city}`,
      route.total_price,
    ]),
  );

  const trips: BalcaoTrip[] = schedules.map((s) => ({
    ...s,
    price: priceByRoute.get(`${s.origin}→${s.destination}`) ?? null,
  }));

  const openSeats = trips.reduce((sum, t) => sum + t.available_seats, 0);
  const metrics: Metric[] = [
    ...(todaySummary
      ? ([
          {
            label: "Recebido hoje",
            value: formatCurrency(todaySummary.total_confirmed),
            accent: "positive",
          },
          { label: "Bilhetes hoje", value: todaySummary.count_confirmed },
        ] as Metric[])
      : []),
    { label: "Viagens abertas", value: trips.length },
    { label: "Lugares por vender", value: openSeats },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <PageHeader
        context="Operação"
        title="Balcão"
        description="Viagens com lugares à venda. Escolhe uma para emitir um bilhete."
      />
      {metrics.length > 0 ? <MetricStrip metrics={metrics} /> : null}
      <BalcaoTripList trips={trips} date={date} />
    </div>
  );
}
