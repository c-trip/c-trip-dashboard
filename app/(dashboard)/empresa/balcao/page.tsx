import Link from "next/link";

import { CompanyBlocked } from "@/components/feedback/company-blocked";
import { DateFilter } from "@/components/feedback/date-filter";
import { SimpleTable } from "@/components/tables/simple-table";
import { getOperatorSchedules } from "@/lib/api/operator";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";

function str(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function BalcaoPage({
  searchParams,
}: PageProps<"/empresa/balcao">) {
  await requirePermission(PERMISSIONS.bookingSell);
  const date = str((await searchParams)?.date);

  let schedules;
  try {
    schedules = await getOperatorSchedules(date);
  } catch {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Balcão
          </h2>
        </div>
        <CompanyBlocked message="A venda ao balcão só está disponível para operadores de empresas aprovadas." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Balcão
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Viagens com lugares à venda. Escolhe uma para vender um bilhete ao
          balcão.
        </p>
      </div>
      <DateFilter initial={date} label="Data de partida" />
      <SimpleTable
        rows={schedules}
        rowKey={(s) => s.schedule_id}
        emptyTitle="Nenhuma viagem aberta"
        emptyDescription="Não há viagens com embarque aberto para a data escolhida."
        columns={[
          {
            header: "Rota",
            cell: (s) => (
              <span className="font-medium">
                {s.origin} → {s.destination}
              </span>
            ),
          },
          {
            header: "Partida",
            cell: (s) => `${s.departure_date} · ${s.departure_time}`,
          },
          {
            header: "Lugares",
            cell: (s) => (
              <span className="tabular-nums">{`${s.available_seats}/${s.total_seats} livres`}</span>
            ),
          },
          {
            header: "",
            cell: (s) =>
              s.available_seats > 0 ? (
                <Link
                  href={`/empresa/balcao/${s.schedule_id}`}
                  className="text-primary hover:underline"
                >
                  Vender
                </Link>
              ) : (
                <span className="text-xs text-muted-foreground">Esgotada</span>
              ),
            className: "text-right",
          },
        ]}
      />
    </div>
  );
}
