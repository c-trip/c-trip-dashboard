"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { SimpleTable } from "@/components/tables/simple-table";
import { formatCurrency } from "@/lib/format";
import type { PeriodTotal } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const chartConfig = {
  total: { label: "Entradas", color: "var(--primary)" },
} satisfies ChartConfig;

function dayLabel(period: string) {
  const [year, month, day] = period.split("-");
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return new Intl.DateTimeFormat("pt-AO", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

function monthLabel(period: string) {
  const [year, month] = period.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return new Intl.DateTimeFormat("pt-AO", {
    month: "short",
    year: "2-digit",
  }).format(date);
}

interface CashFlowReportProps {
  /** `by_day` do resumo financeiro — mais recente primeiro. */
  byDay: PeriodTotal[];
  /** `by_month` do resumo financeiro — mais recente primeiro. */
  byMonth: PeriodTotal[];
}

/**
 * Relatório de fluxo de caixa: movimento de pagamentos confirmados por período,
 * com gráfico de barras, tabela detalhada e acumulado. Alterna dia / mês.
 */
export function CashFlowReport({ byDay, byMonth }: CashFlowReportProps) {
  const [granularity, setGranularity] = useState<"day" | "month">("day");
  const source = granularity === "day" ? byDay : byMonth;
  const label = granularity === "day" ? dayLabel : monthLabel;

  // O backend devolve do mais recente primeiro; queremos ordem cronológica e o acumulado.
  const rows = useMemo(() => {
    const chronological = [...source].reverse();
    return chronological.map((item, index) => ({
      ...item,
      label: label(item.period),
      cumulative: chronological
        .slice(0, index + 1)
        .reduce((sum, entry) => sum + entry.total, 0),
    }));
  }, [source, label]);

  const chartData = rows.map((row) => ({
    period: row.label,
    total: row.total,
  }));
  const totalPeriod = rows.reduce((sum, row) => sum + row.total, 0);
  const totalCount = rows.reduce((sum, row) => sum + row.count, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <CardTitle>Fluxo de caixa</CardTitle>
          <CardDescription>
            Pagamentos confirmados por {granularity === "day" ? "dia" : "mês"} —{" "}
            {formatCurrency(totalPeriod)} em {totalCount} pagamento(s).
          </CardDescription>
        </div>
        <div className="flex rounded-lg border border-border p-0.5 text-sm">
          {(["day", "month"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setGranularity(option)}
              className={cn(
                "rounded-md px-3 py-1 font-medium transition-colors",
                granularity === option
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {option === "day" ? "Dia" : "Mês"}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {rows.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Ainda não há pagamentos confirmados no período seleccionado.
          </p>
        ) : (
          <>
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[240px] w-full"
            >
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="period"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={80}
                  tickFormatter={(value: number) => formatCurrency(value)}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value) => formatCurrency(Number(value))}
                      indicator="dot"
                    />
                  }
                />
                <Bar
                  dataKey="total"
                  fill="var(--color-total)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>

            <SimpleTable
              rows={[...rows].reverse()}
              rowKey={(row) => row.period}
              emptyTitle="Sem movimentos"
              columns={[
                { header: "Período", cell: (row) => row.label },
                {
                  header: "Entradas",
                  cell: (row) => (
                    <span className="font-medium tabular-nums">
                      {formatCurrency(row.total)}
                    </span>
                  ),
                  className: "text-right",
                },
                {
                  header: "Pagamentos",
                  cell: (row) => (
                    <span className="tabular-nums">{row.count}</span>
                  ),
                  className: "text-right",
                },
                {
                  header: "Acumulado",
                  cell: (row) => (
                    <span className="tabular-nums text-muted-foreground">
                      {formatCurrency(row.cumulative)}
                    </span>
                  ),
                  className: "text-right",
                },
              ]}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
