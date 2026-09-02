"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface PaymentsFilterValues {
  date_from?: string;
  date_to?: string;
  method?: string;
}

const selectClass =
  "flex h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const METHODS = ["cash", "pos", "multicaixa_express"] as const;

/**
 * Barra de filtros para os dashboards de pagamentos. Escreve os filtros na query
 * string — os Server Components lêem `searchParams` e re-pedem o resumo ao backend.
 * `offset` (paginação) é preservado quando existe.
 */
export function PaymentsFilterBar({
  initial,
}: {
  initial: PaymentsFilterValues;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [dateFrom, setDateFrom] = useState(initial.date_from ?? "");
  const [dateTo, setDateTo] = useState(initial.date_to ?? "");
  const [method, setMethod] = useState(initial.method ?? "");

  function apply() {
    const params = new URLSearchParams();
    if (dateFrom) params.set("date_from", dateFrom);
    if (dateTo) params.set("date_to", dateTo);
    if (method) params.set("method", method);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  function clear() {
    setDateFrom("");
    setDateTo("");
    setMethod("");
    router.push(pathname);
  }

  const hasFilters = Boolean(dateFrom || dateTo || method);

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4 shadow-xs">
      <FormField htmlFor="date_from" label="De" className="min-w-36 flex-1">
        <Input
          id="date_from"
          type="date"
          value={dateFrom}
          max={dateTo || undefined}
          onChange={(e) => setDateFrom(e.target.value)}
        />
      </FormField>
      <FormField htmlFor="date_to" label="Até" className="min-w-36 flex-1">
        <Input
          id="date_to"
          type="date"
          value={dateTo}
          min={dateFrom || undefined}
          onChange={(e) => setDateTo(e.target.value)}
        />
      </FormField>
      <FormField htmlFor="method" label="Método" className="min-w-40 flex-1">
        <select
          id="method"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className={selectClass}
        >
          <option value="">Todos</option>
          {METHODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </FormField>
      <div className="flex gap-2">
        <Button type="button" onClick={apply}>
          Aplicar
        </Button>
        {hasFilters ? (
          <Button type="button" variant="outline" onClick={clear}>
            Limpar
          </Button>
        ) : null}
      </div>
    </div>
  );
}
