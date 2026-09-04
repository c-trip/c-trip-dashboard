import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface Metric {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  href?: string;
  accent?: "default" | "positive" | "warning" | "negative";
}

const ACCENT: Record<NonNullable<Metric["accent"]>, string> = {
  default: "text-foreground",
  positive: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  negative: "text-destructive",
};

/**
 * Faixa de métricas — números-chave numa grelha unida por hairlines, sem
 * cartões nem sombras. O registo corporativo do dashboard.
 */
export function MetricStrip({ metrics }: { metrics: Metric[] }) {
  return (
    <div
      className="grid gap-px overflow-hidden rounded-xl border border-border bg-border"
      style={{
        gridTemplateColumns: `repeat(${Math.min(metrics.length, 4)}, minmax(0, 1fr))`,
      }}
    >
      {metrics.map((metric) => {
        const Wrapper = metric.href ? "a" : "div";
        return (
          <Wrapper
            key={metric.label}
            href={metric.href}
            className={cn(
              "bg-card px-4 py-3",
              metric.href && "transition-colors hover:bg-muted/40",
            )}
          >
            <p className="text-xs text-muted-foreground">{metric.label}</p>
            <p
              className={cn(
                "mt-1 text-xl font-semibold tabular-nums",
                ACCENT[metric.accent ?? "default"],
              )}
            >
              {metric.value}
            </p>
            {metric.hint ? (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {metric.hint}
              </p>
            ) : null}
          </Wrapper>
        );
      })}
    </div>
  );
}
