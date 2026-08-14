import { apiFetch } from "@/lib/api/client";
import type { PaymentStatus } from "@/lib/api/types";

export interface CompanyPayment {
  payment_id: string;
  booking_id: string;
  amount: number;
  method: string;
  status: PaymentStatus;
  created_at: string;
}

// A API não devolve totais prontos — somas/gráficos têm de ser calculados a partir da lista.
export function getCompanyPayments() {
  return apiFetch<CompanyPayment[]>("/payments/company");
}
