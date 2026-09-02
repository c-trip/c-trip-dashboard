import { apiFetch } from "@/lib/api/client";
import { toQueryString } from "@/lib/api/types";

/**
 * Operações de balcão e embarque (tag `Operator` da API — `/boarding/*`).
 * O backend autoriza estes endpoints pelo perfil `sales_operator`.
 */

export interface OperatorSchedule {
  schedule_id: string;
  origin: string;
  destination: string;
  departure_date: string;
  departure_time: string;
  total_seats: number;
  available_seats: number;
  status: string;
}

/** Viagens abertas da empresa do operador. `date` (YYYY-MM-DD) — omitir = hoje. */
export function getOperatorSchedules(date?: string) {
  return apiFetch<OperatorSchedule[]>(
    `/boarding/schedules${toQueryString({ date })}`,
  );
}

export interface OperatorSaleInput {
  schedule_id: string;
  seat_number: number;
  passenger_name: string;
  passenger_phone?: string;
  passenger_id_doc?: string;
  total_price: number;
  /** `cash` | `pos` | `multicaixa_express` — omitir = `cash`. */
  payment_method?: string;
}

export interface OperatorSaleResponse {
  booking_id: string;
  payment_id: string;
  qr_hash: string;
  /** QR code em base64 (data URI SVG). */
  qr_image: string;
  passenger_name: string;
  seat_number: number;
  origin: string;
  destination: string;
  departure_date: string;
  departure_time: string;
  company_name: string;
  valid_until: string;
}

/** Venda ao balcão: cria reserva + pagamento confirmado + QR num único passo. */
export function operatorSell(input: OperatorSaleInput) {
  return apiFetch<OperatorSaleResponse>("/boarding/operator/sell", {
    method: "POST",
    body: input,
  });
}

export interface ReprintQrResponse {
  qr_hash: string;
  qr_image: string;
  passenger_name: string;
  seat_number: number;
  booking_id: string;
}

export function reprintQr(scheduleId: string, seatNumber: number) {
  return apiFetch<ReprintQrResponse>("/boarding/qr/reprint", {
    method: "POST",
    body: { schedule_id: scheduleId, seat_number: seatNumber },
  });
}

export type BoardingValidationStatus =
  "allowed" | "already_boarded" | "invalid";

export interface ValidateQrResponse {
  status: BoardingValidationStatus;
  passenger: string;
  seat_number: number;
  destination: string;
  first_boarded_at: string;
  reason: string;
}

/**
 * Valida um QR de embarque. `scheduleId` opcional — se dado, o QR só é aceite se
 * pertencer a essa viagem (impede embarcar no autocarro errado).
 */
export function validateQr(qrHash: string, scheduleId?: string) {
  return apiFetch<ValidateQrResponse>("/boarding/validate", {
    method: "POST",
    body: { qr_hash: qrHash, schedule_id: scheduleId },
  });
}

export interface BoardingRecordResponse {
  boarding_id: string;
  boarded_at: string;
}

/** Regista que o passageiro embarcou. Requer QR válido. */
export function recordBoarding(qrHash: string, scheduleId?: string) {
  return apiFetch<BoardingRecordResponse>("/boarding/record", {
    method: "POST",
    body: { qr_hash: qrHash, schedule_id: scheduleId },
  });
}

export interface ManifestItem {
  booking_id: string;
  seat: number;
  status: string;
}

/** Manifesto de passageiros de uma viagem (todas as reservas e o seu estado). */
export function getManifest(scheduleId: string) {
  return apiFetch<ManifestItem[]>(
    `/boarding/manifest${toQueryString({ schedule_id: scheduleId })}`,
  );
}
