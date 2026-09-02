import { apiFetch } from "@/lib/api/client";
import type { PaymentStatus, PaymentsSummary } from "@/lib/api/types";

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

/**
 * Resumo financeiro já agregado pelo backend (recebido/pendente/falhado/cancelado
 * + quebra por dia e por mês) — só dos pagamentos ligados às rotas da empresa.
 */
export function getCompanyPaymentsSummary() {
  return apiFetch<PaymentsSummary>("/payments/company/summary");
}
