"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { DateRange } from "react-day-picker";
import { format, parseISO } from "date-fns";
import { pt } from "date-fns/locale";
import {
  IconCalendarEvent,
  IconCheck,
  IconChevronDown,
  IconFilter,
} from "@tabler/icons-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface PaymentsFilterValues {
  date_from?: string;
  date_to?: string;
  method?: string;
}

const METHODS: Array<{ value: string; label: string }> = [
  { value: "", label: "Todos os métodos" },
  { value: "cash", label: "Dinheiro" },
  { value: "pos", label: "POS" },
  { value: "multicaixa_express", label: "Multicaixa Express" },
];

const PRESETS: Array<{ key: string; label: string }> = [
  { key: "7d", label: "Últimos 7 dias" },
  { key: "30d", label: "Últimos 30 dias" },
  { key: "month", label: "Este mês" },
  { key: "year", label: "Este ano" },
];

function ymd(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

function rangeFor(key: string): { from: string; to: string } {
  const today = new Date();
  const to = ymd(today);
  if (key === "7d") {
    const d = new Date(today);
    d.setDate(d.getDate() - 6);
    return { from: ymd(d), to };
  }
  if (key === "30d") {
    const d = new Date(today);
    d.setDate(d.getDate() - 29);
    return { from: ymd(d), to };
  }
  if (key === "month")
    return {
      from: ymd(new Date(today.getFullYear(), today.getMonth(), 1)),
      to,
    };
  if (key === "year")
    return { from: ymd(new Date(today.getFullYear(), 0, 1)), to };
  return { from: "", to: "" };
}

function labelForRange(from: string, to: string): string {
  if (!from && !to) return "Selecionar datas";
  const preset = PRESETS.find((p) => {
    const r = rangeFor(p.key);
    return r.from === from && r.to === to;
  });
  if (preset) return preset.label;
  const fmt = (s: string) =>
    s
      ? new Intl.DateTimeFormat("pt-AO", {
          day: "2-digit",
          month: "short",
        }).format(new Date(s))
      : "…";
  return `${fmt(from)} – ${fmt(to)}`;
}

const triggerClass = cn(
  buttonVariants({ variant: "outline", size: "sm" }),
  "gap-1.5",
);

export function PaymentsFilterBar({
  initial,
}: {
  initial: PaymentsFilterValues;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const from = initial.date_from ?? "";
  const to = initial.date_to ?? "";
  const method = initial.method ?? "";

  const [range, setRange] = useState<DateRange | undefined>(
    from || to
      ? {
          from: from ? parseISO(from) : undefined,
          to: to ? parseISO(to) : undefined,
        }
      : undefined,
  );

  function push(next: PaymentsFilterValues) {
    const params = new URLSearchParams();
    if (next.date_from) params.set("date_from", next.date_from);
    if (next.date_to) params.set("date_to", next.date_to);
    if (next.method) params.set("method", next.method);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  const methodLabel =
    METHODS.find((m) => m.value === method)?.label ?? "Todos os métodos";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Popover>
        <PopoverTrigger className={triggerClass}>
          <IconCalendarEvent size={16} />
          {labelForRange(from, to)}
          <IconChevronDown size={14} className="text-muted-foreground" />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex min-w-40 flex-col gap-1">
              {PRESETS.map((p) => {
                const r = rangeFor(p.key);
                const active = r.from === from && r.to === to;
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() =>
                      push({ date_from: r.from, date_to: r.to, method })
                    }
                    className={cn(
                      "flex items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition-colors hover:bg-muted",
                      active && "font-medium text-primary",
                    )}
                  >
                    {p.label}
                    {active ? <IconCheck size={15} /> : null}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-col gap-2 border-t border-border pt-2 sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0">
              <Calendar
                mode="range"
                locale={pt}
                numberOfMonths={1}
                selected={range}
                onSelect={setRange}
                defaultMonth={range?.from}
              />
              <Button
                type="button"
                size="sm"
                disabled={!range?.from || !range?.to}
                onClick={() =>
                  range?.from &&
                  range?.to &&
                  push({
                    date_from: format(range.from, "yyyy-MM-dd"),
                    date_to: format(range.to, "yyyy-MM-dd"),
                    method,
                  })
                }
              >
                Aplicar intervalo
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger className={triggerClass}>
          <IconFilter size={16} />
          Filtros
          {method ? (
            <span className="rounded-full bg-primary/10 px-1.5 text-xs font-semibold text-primary">
              1
            </span>
          ) : null}
          <IconChevronDown size={14} className="text-muted-foreground" />
        </PopoverTrigger>
        <PopoverContent align="end" className="w-56">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Método de pagamento
          </p>
          <div className="flex flex-col gap-0.5">
            {METHODS.map((m) => (
              <button
                key={m.value || "all"}
                type="button"
                onClick={() =>
                  push({ date_from: from, date_to: to, method: m.value })
                }
                className={cn(
                  "flex items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition-colors hover:bg-muted",
                  method === m.value && "font-medium text-primary",
                )}
              >
                {m.label}
                {method === m.value ? <IconCheck size={15} /> : null}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {(from || to || method) && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => push({})}
          className="text-muted-foreground"
        >
          Limpar
        </Button>
      )}

      {method ? (
        <span className="ms-1 text-xs text-muted-foreground">
          · {methodLabel}
        </span>
      ) : null}
    </div>
  );
}
