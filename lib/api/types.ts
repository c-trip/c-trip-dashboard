export type CompanyStatus = "pending" | "verified" | "rejected" | "suspended";
export type ScheduleStatus = "scheduled" | "cancelled";
export type BookingStatus = "confirmed" | "cancelled";
export type PaymentStatus =
  "pending" | "confirmed" | "failed" | "cancelled" | "no_payment";
export type TaskStatus = "pending" | "in_progress" | "done";
export type BusStatus = "active" | "maintenance" | "inactive";

/**
 * Filtros aceites por `/admin/payments/summary` e `/payments/company/summary`.
 * Campos comuns; cada endpoint tem ainda os seus (`company_id` no admin,
 * `route_id`/`schedule_id` na empresa) — ver `AdminPaymentsSummaryFilters` /
 * `CompanyPaymentsSummaryFilters` nos módulos respectivos.
 */
export interface PaymentsSummaryFilters {
  /** `YYYY-MM-DD` ou ISO 8601. */
  date_from?: string;
  date_to?: string;
  /** ex.: `cash`, `pos`, `multicaixa_express`. */
  method?: string;
  group_by?: "day" | "month" | "both";
}

/** Constrói uma query string a partir de um objecto, ignorando valores vazios. */
export function toQueryString(params: object): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(
    params as Record<string, unknown>,
  )) {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

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
