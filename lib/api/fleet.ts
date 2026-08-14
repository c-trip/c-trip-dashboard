import { apiFetch } from "@/lib/api/client";
import type { BusStatus, TaskStatus } from "@/lib/api/types";

export interface Bus {
  id: string;
  model: string;
  plate: string;
  seats: number;
  status: BusStatus;
}

export function getBuses() {
  return apiFetch<Bus[]>("/fleet/buses");
}

export interface CreateBusInput {
  model: string;
  license_plate: string;
  total_rows: number;
  seats_per_row: number;
}

export function createBus(input: CreateBusInput) {
  return apiFetch<{ id: string; model: string; license_plate: string; total_seats: number }>(
    "/fleet/buses",
    { method: "POST", body: input }
  );
}

export interface UpdateBusInput {
  model?: string;
  license_plate?: string;
  status?: BusStatus;
}

export function updateBus(busId: string, input: UpdateBusInput) {
  return apiFetch<Bus>(`/fleet/buses/${busId}`, { method: "PATCH", body: input });
}

export interface Driver {
  id: string;
  name: string;
  phone?: string;
  available: boolean;
}

export function getDrivers() {
  return apiFetch<Driver[]>("/fleet/drivers");
}

export interface CreateDriverInput {
  /** Tem de já existir como utilizador da mesma empresa. */
  user_id: string;
  name: string;
  phone?: string;
}

export function createDriver(input: CreateDriverInput) {
  return apiFetch<{ id: string; name: string; user_id: string }>("/fleet/drivers", {
    method: "POST",
    body: input,
  });
}

export interface UpdateDriverInput {
  name?: string;
  phone?: string;
  is_available?: boolean;
}

export function updateDriver(driverId: string, input: UpdateDriverInput) {
  return apiFetch<Driver>(`/fleet/drivers/${driverId}`, { method: "PATCH", body: input });
}

export interface FleetTask {
  id: string;
  title: string;
  status: TaskStatus;
}

export interface CreateTaskInput {
  assigned_to: string;
  title: string;
  description: string;
}

export function createTask(input: CreateTaskInput) {
  return apiFetch<FleetTask>("/fleet/tasks", { method: "POST", body: input });
}

export function getMyTasks() {
  return apiFetch<FleetTask[]>("/fleet/tasks");
}

export function updateTaskStatus(taskId: string, status: TaskStatus) {
  return apiFetch<FleetTask>(`/fleet/tasks/${taskId}`, { method: "PATCH", body: { status } });
}
