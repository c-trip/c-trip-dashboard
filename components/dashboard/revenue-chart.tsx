"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatCurrency } from "@/lib/format";
import type { PeriodTotal } from "@/lib/api/types";

const chartConfig = {
  total: { label: "Recebido", color: "var(--primary)" },
} satisfies ChartConfig;

function monthLabel(period: string) {
  // period vem como "YYYY-MM"
  const [year, month] = period.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return new Intl.DateTimeFormat("pt-AO", { month: "short", year: "2-digit" }).format(date);
}

interface RevenueChartProps {
  /** `by_month` do resumo financeiro — vem do mais recente primeiro. */
  byMonth: PeriodTotal[];
  title?: string;
  description?: string;
}

export function RevenueChart({
  byMonth,
  title = "Receita confirmada",
  description = "Pagamentos confirmados por mês",
}: RevenueChartProps) {
  // O backend devolve do mais recente primeiro; o gráfico lê da esquerda (antigo) para a direita.
  const data = [...byMonth]
    .reverse()
    .map((item) => ({ period: monthLabel(item.period), total: item.total }));

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {data.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Ainda não há pagamentos confirmados para mostrar.
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-total)" stopOpacity={1.0} />
                  <stop offset="95%" stopColor="var(--color-total)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="period" tickLine={false} axisLine={false} tickMargin={8} />
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
              <Area
                dataKey="total"
                type="natural"
                fill="url(#fillRevenue)"
                stroke="var(--color-total)"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
