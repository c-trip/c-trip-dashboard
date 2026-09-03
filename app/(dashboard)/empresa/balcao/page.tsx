import { unstable_rethrow } from "next/navigation";

import {
  BalcaoTripList,
  type BalcaoTrip,
} from "@/components/operator/balcao-trip-list";
import { ApiErrorState } from "@/components/feedback/api-error-state";
import { DateFilter } from "@/components/feedback/date-filter";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Balcão
          </h2>
        </div>
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

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Balcão
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Viagens com lugares à venda. Escolhe uma para vender um bilhete.
          </p>
        </div>
        {todaySummary ? (
          <Card className="gap-1 py-3">
            <CardHeader className="px-4">
              <CardDescription>Recebido hoje (empresa)</CardDescription>
              <CardTitle className="text-lg font-semibold tabular-nums">
                {formatCurrency(todaySummary.total_confirmed)}
              </CardTitle>
              <p className="text-xs text-muted-foreground tabular-nums">
                {todaySummary.count_confirmed} bilhete(s)
              </p>
            </CardHeader>
          </Card>
        ) : null}
      </div>
      <DateFilter initial={date} label="Data de partida" />
      <BalcaoTripList trips={trips} />
    </div>
  );
}
