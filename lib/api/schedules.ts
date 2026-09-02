import { apiFetch } from "@/lib/api/client";
import type { ScheduleStatus } from "@/lib/api/types";

export interface CompanySchedule {
  schedule_id: string;
  route_id: string;
  origin: string;
  destination: string;
  departure_date: string; // "YYYY-MM-DD"
  departure_time: string; // "HH:MM"
  status: ScheduleStatus;
  total_seats: number;
  available_seats: number;
}

export function getCompanySchedules() {
  return apiFetch<CompanySchedule[]>("/schedules/company");
}

export interface CreateScheduleInput {
  route_id: string;
  bus_id: string;
  driver_id: string;
  departure_date: string;
  departure_time: string;
  total_seats: number;
  /** Minutos antes da partida em que a compra fecha. Omitir = 30. */
  boarding_cutoff_minutes?: number;
}

export interface ScheduleDetail {
  id: string;
  route_id: string;
  departure_date: string;
  departure_time: string;
  status: ScheduleStatus;
  boarding_cutoff_minutes: number;
}

export function createSchedule(input: CreateScheduleInput) {
  return apiFetch<ScheduleDetail>("/schedules/", {
    method: "POST",
    body: input,
  });
}

export interface UpdateScheduleInput {
  bus_id?: string;
  driver_id?: string;
  departure_date?: string;
  departure_time?: string;
  total_seats?: number;
  boarding_cutoff_minutes?: number;
}

export function updateSchedule(scheduleId: string, input: UpdateScheduleInput) {
  return apiFetch<ScheduleDetail>(`/schedules/${scheduleId}`, {
    method: "PATCH",
    body: input,
  });
}

export function cancelSchedule(scheduleId: string) {
  return apiFetch<{ id: string; status: "cancelled" }>(
    "/schedules/actions/cancel",
    {
      method: "POST",
      body: { schedule_id: scheduleId },
    },
  );
}

/**
 * Detalhe completo de uma viagem (endpoint público). Traz os dados do autocarro e
 * motorista associados — que a listagem `/schedules/company` não devolve.
 */
export interface ScheduleFullDetail {
  id: string;
  bus_model: string;
  bus_plate: string;
  driver_name: string;
  departure_date: string;
  departure_time: string;
  status: ScheduleStatus;
  total_seats: number;
  boarding_cutoff_minutes: number;
}

export function getSchedule(scheduleId: string) {
  return apiFetch<ScheduleFullDetail>(`/schedules/${scheduleId}`);
}

/** Mapa de lugares de uma viagem: quais estão livres e quais já foram reservados. */
export interface ScheduleSeats {
  total_seats: number;
  available: number[];
  occupied: number[];
}

export function getScheduleSeats(scheduleId: string) {
  return apiFetch<ScheduleSeats>(`/schedules/${scheduleId}/seats`);
}
