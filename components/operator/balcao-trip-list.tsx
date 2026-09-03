"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { IconSearch } from "@tabler/icons-react";

import { DatePickerButton } from "@/components/feedback/date-picker-button";
import { EmptyState } from "@/components/feedback/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/format";
import type { OperatorSchedule } from "@/lib/api/operator";
import { cn } from "@/lib/utils";

export type BalcaoTrip = OperatorSchedule & { price: number | null };

export function BalcaoTripList({
  trips,
  date,
}: {
  trips: BalcaoTrip[];
  date?: string;
}) {
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
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-56 flex-1">
          <IconSearch
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Procurar origem ou destino"
            className="ps-9"
          />
        </div>
        <DatePickerButton value={date} />
        <span className="ms-auto text-sm text-muted-foreground tabular-nums">
          {rows.length} {rows.length === 1 ? "viagem" : "viagens"}
        </span>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title={query ? "Sem resultados" : "Nenhuma viagem aberta"}
          description={
            query
              ? "Nenhuma viagem corresponde à pesquisa."
              : "Não há viagens com embarque aberto nesta data."
          }
        />
      ) : (
        <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {rows.map((trip) => {
            const soldOut = trip.available_seats === 0;
            return (
              <div
                key={trip.schedule_id}
                className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4 transition-colors hover:bg-muted/40"
              >
                <div className="w-16 shrink-0">
                  <p className="text-base font-semibold tabular-nums text-foreground">
                    {trip.departure_time}
                  </p>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {trip.departure_date}
                  </p>
                </div>

                <div className="min-w-40 flex-1">
                  <p className="font-medium text-foreground">
                    {trip.origin} → {trip.destination}
                  </p>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {trip.available_seats} de {trip.total_seats} lugares livres
                  </p>
                </div>

                <p className="w-28 shrink-0 text-right font-medium tabular-nums text-foreground">
                  {trip.price != null ? formatCurrency(trip.price) : "—"}
                </p>

                {soldOut ? (
                  <span className="w-24 shrink-0 text-right text-sm text-muted-foreground">
                    Esgotada
                  </span>
                ) : (
                  <Link
                    href={`/empresa/balcao/${trip.schedule_id}${
                      trip.price != null ? `?price=${trip.price}` : ""
                    }`}
                    className={cn(
                      buttonVariants({ size: "sm" }),
                      "w-24 shrink-0",
                    )}
                  >
                    Vender
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
