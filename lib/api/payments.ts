import { apiFetch } from "@/lib/api/client";
import {
  toQueryString,
  type PaymentStatus,
  type PaymentsSummary,
  type PaymentsSummaryFilters,
} from "@/lib/api/types";

export interface CompanyPayment {
  payment_id: string;
  booking_id: string;
  amount: number;
  method: string;
  status: PaymentStatus;
  created_at: string;
}

// A API não devolve totais prontos para a lista — o resumo agregado vem de getCompanyPaymentsSummary().
export function getCompanyPayments() {
  return apiFetch<CompanyPayment[]>("/payments/company");
}

export interface CompanyPaymentsSummaryFilters extends PaymentsSummaryFilters {
  /** Filtrar por rota da empresa (UUID). */
  route_id?: string;
  /** Filtrar por viagem da empresa (UUID). */
  schedule_id?: string;
}

/**
 * Resumo financeiro já agregado pelo backend (recebido/pendente/falhado/cancelado
 * + quebra por dia e por mês) — só dos pagamentos ligados às rotas da empresa.
 * Aceita filtros de período, método, rota e viagem.
 */
export function getCompanyPaymentsSummary(
  filters: CompanyPaymentsSummaryFilters = {},
) {
  return apiFetch<PaymentsSummary>(
    `/payments/company/summary${toQueryString(filters)}`,
  );
}
