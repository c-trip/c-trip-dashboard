// Enums documentados em Docs/C-Trip_Guia_Frontend.pdf, secção 7 "Referência Rápida".
// Fonte única de verdade para <StatusBadge> e para qualquer filtro/etiqueta de estado.

export type CompanyStatus = "pending" | "verified" | "rejected" | "suspended";
export type ScheduleStatus = "scheduled" | "cancelled";
export type BookingStatus = "confirmed" | "cancelled";
export type PaymentStatus = "pending" | "confirmed" | "failed" | "cancelled" | "no_payment";
export type TaskStatus = "pending" | "in_progress" | "done";
export type BusStatus = "active" | "maintenance" | "inactive";
