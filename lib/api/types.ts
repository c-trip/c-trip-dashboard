export type CompanyStatus = "pending" | "verified" | "rejected" | "suspended";
export type ScheduleStatus = "scheduled" | "cancelled";
export type BookingStatus = "confirmed" | "cancelled";
export type PaymentStatus = "pending" | "confirmed" | "failed" | "cancelled" | "no_payment";
export type TaskStatus = "pending" | "in_progress" | "done";
export type BusStatus = "active" | "maintenance" | "inactive";

/** Total de pagamentos `confirmed` num período (dia `YYYY-MM-DD` ou mês `YYYY-MM`). */
export interface PeriodTotal {
  period: string;
  total: number;
  count: number;
}

/**
 * Resumo financeiro devolvido tanto por `/admin/payments/summary` (global) como
 * por `/payments/company/summary` (só rotas da empresa) — mesmo contrato.
 * `by_day`/`by_month` vêm ordenados do mais recente primeiro.
 */
export interface PaymentsSummary {
  total_confirmed: number;
  count_confirmed: number;
  total_pending: number;
  count_pending: number;
  total_failed: number;
  count_failed: number;
  total_cancelled: number;
  count_cancelled: number;
  by_day: PeriodTotal[];
  by_month: PeriodTotal[];
}
