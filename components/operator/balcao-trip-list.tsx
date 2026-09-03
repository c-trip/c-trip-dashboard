"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { IconSearch } from "@tabler/icons-react";

import { SimpleTable } from "@/components/tables/simple-table";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/format";
import type { OperatorSchedule } from "@/lib/api/operator";

export type BalcaoTrip = OperatorSchedule & { price: number | null };

export function BalcaoTripList({ trips }: { trips: BalcaoTrip[] }) {
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = needle
      ? trips.filter(
          (t) =>
            t.origin.toLowerCase().includes(needle) ||
            t.destination.toLowerCase().includes(needle),
        )
      : trips;
    return [...filtered].sort((a, b) =>
      `${a.departure_date}T${a.departure_time}`.localeCompare(
        `${b.departure_date}T${b.departure_time}`,
      ),
    );
  }, [trips, query]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative max-w-xs">
        <IconSearch
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Procurar por origem ou destino"
          className="ps-9"
        />
      </div>
      <SimpleTable
        rows={rows}
        rowKey={(s) => s.schedule_id}
        emptyTitle={query ? "Sem resultados" : "Nenhuma viagem aberta"}
        emptyDescription={
          query
            ? "Nenhuma viagem corresponde à pesquisa."
            : "Não há viagens com embarque aberto para a data escolhida."
        }
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
            header: "Preço",
            cell: (s) => (
              <span className="tabular-nums">
                {s.price != null ? formatCurrency(s.price) : "—"}
              </span>
            ),
            className: "text-right",
          },
          {
            header: "Lugares",
            cell: (s) => (
              <span className="tabular-nums">{`${s.available_seats}/${s.total_seats}`}</span>
            ),
            className: "text-right",
          },
          {
            header: "",
            cell: (s) =>
              s.available_seats > 0 ? (
                <Link
                  href={`/empresa/balcao/${s.schedule_id}${s.price != null ? `?price=${s.price}` : ""}`}
                  className="font-medium text-primary hover:underline"
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
