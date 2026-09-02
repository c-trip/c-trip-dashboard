"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface PaymentsFilterValues {
  date_from?: string;
  date_to?: string;
  method?: string;
}

const selectClass =
  "h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const METHODS: Array<{ value: string; label: string }> = [
  { value: "", label: "Todos os métodos" },
  { value: "cash", label: "Dinheiro" },
  { value: "pos", label: "POS" },
  { value: "multicaixa_express", label: "Multicaixa Express" },
];

const PERIODS: Array<{ value: string; label: string }> = [
  { value: "", label: "Desde sempre" },
  { value: "7d", label: "Últimos 7 dias" },
  { value: "30d", label: "Últimos 30 dias" },
  { value: "month", label: "Este mês" },
  { value: "year", label: "Este ano" },
  { value: "custom", label: "Intervalo personalizado" },
];

function ymd(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

function rangeFor(period: string): { from: string; to: string } {
  const today = new Date();
  const to = ymd(today);
  if (period === "7d") {
    const d = new Date(today);
    d.setDate(d.getDate() - 6);
    return { from: ymd(d), to };
  }
  if (period === "30d") {
    const d = new Date(today);
    d.setDate(d.getDate() - 29);
    return { from: ymd(d), to };
  }
  if (period === "month") {
    return {
      from: ymd(new Date(today.getFullYear(), today.getMonth(), 1)),
      to,
    };
  }
  if (period === "year") {
    return { from: ymd(new Date(today.getFullYear(), 0, 1)), to };
  }
  return { from: "", to: "" };
}

/** Deduz qual dos períodos pré-definidos corresponde ao intervalo actual. */
function periodFromRange(from: string, to: string): string {
  if (!from && !to) return "";
  for (const key of ["7d", "30d", "month", "year"]) {
    const r = rangeFor(key);
    if (r.from === from && r.to === to) return key;
  }
  return "custom";
}

/**
 * Filtros do relatório de fluxo de caixa: período (com atalhos e intervalo
 * personalizado) e método de pagamento. Escreve na query string; os Server
 * Components lêem `searchParams` e re-pedem o resumo ao backend.
 */
export function PaymentsFilterBar({
  initial,
}: {
  initial: PaymentsFilterValues;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const initialPeriod = periodFromRange(
    initial.date_from ?? "",
    initial.date_to ?? "",
  );
  const [period, setPeriod] = useState(initialPeriod);
  const [dateFrom, setDateFrom] = useState(initial.date_from ?? "");
  const [dateTo, setDateTo] = useState(initial.date_to ?? "");
  const method = initial.method ?? "";

  function push(next: { from: string; to: string; method: string }) {
    const params = new URLSearchParams();
    if (next.from) params.set("date_from", next.from);
    if (next.to) params.set("date_to", next.to);
    if (next.method) params.set("method", next.method);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  function onPeriodChange(value: string) {
    setPeriod(value);
    if (value === "custom") return; // espera o "Aplicar"
    const { from, to } = rangeFor(value);
    setDateFrom(from);
    setDateTo(to);
    push({ from, to, method });
  }

  const customDirty =
    period === "custom" &&
    (dateFrom !== (initial.date_from ?? "") ||
      dateTo !== (initial.date_to ?? ""));

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        aria-label="Período"
        value={period}
        onChange={(e) => onPeriodChange(e.target.value)}
        className={selectClass}
      >
        {PERIODS.map((p) => (
          <option key={p.value || "all"} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>

      {period === "custom" ? (
        <div className="flex items-center gap-2">
          <Input
            type="date"
            aria-label="Data inicial"
            value={dateFrom}
            max={dateTo || undefined}
            onChange={(e) => setDateFrom(e.target.value)}
            className="h-9 w-40"
          />
          <span className="text-sm text-muted-foreground">até</span>
          <Input
            type="date"
            aria-label="Data final"
            value={dateTo}
            min={dateFrom || undefined}
            onChange={(e) => setDateTo(e.target.value)}
            className="h-9 w-40"
          />
          <Button
            type="button"
            size="sm"
            disabled={!customDirty || !dateFrom || !dateTo}
            onClick={() => push({ from: dateFrom, to: dateTo, method })}
          >
            Aplicar
          </Button>
        </div>
      ) : null}

      <select
        aria-label="Método de pagamento"
        value={method}
        onChange={(e) =>
          push({ from: dateFrom, to: dateTo, method: e.target.value })
        }
        className={`${selectClass} ms-auto`}
      >
        {METHODS.map((m) => (
          <option key={m.value || "all"} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
    </div>
  );
}
