import { apiFetch } from "@/lib/api/client";
import {
  toQueryString,
  type CompanyStatus,
  type PaymentStatus,
  type PaymentsSummary,
  type PaymentsSummaryFilters,
} from "@/lib/api/types";

export interface PendingCompany {
  id: string;
  name: string;
  email: string;
  phone: string;
  nif: string;
  responsible_name: string;
  status: "pending";
}

export function getPendingCompanies() {
  return apiFetch<PendingCompany[]>("/admin/companies/pending");
}

/**
 * Endpoint alternativo, equivalente a `/admin/companies/pending`. O backend expõe
 * os dois; a app usa `getPendingCompanies()` — este existe só por paridade com o
 * catálogo da API. Preferir sempre `getPendingCompanies()`.
 */
export function getPendingCompaniesLegacy() {
  return apiFetch<PendingCompany[]>("/companies/pending");
}

export type CompanyModerationAction = "approve" | "reject" | "suspend";

// Não existe endpoint de "reverter suspensão" — reactivar uma empresa suspensa
// é chamar "approve" de novo (ver guia de integração, secção Admin).
export function moderateCompany(
  companyId: string,
  action: CompanyModerationAction,
) {
  return apiFetch<{ id: string; status: CompanyStatus }>(
    `/admin/companies/actions/${action}`,
    {
      method: "POST",
      body: { company_id: companyId },
    },
  );
}

export interface AdminCompany {
  id: string;
  name: string;
  email: string;
  status: CompanyStatus;
  company_type: string;
  created_at: string;
}

export function getAllCompanies(status?: CompanyStatus) {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiFetch<AdminCompany[]>(`/admin/companies${query}`);
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

// Paginação simples por offset — a resposta não inclui o total de registos.
export function getAllUsers(limit = 100, offset = 0) {
  return apiFetch<AdminUser[]>(`/admin/users?limit=${limit}&offset=${offset}`);
}

export interface AdminPayment {
  payment_id: string;
  booking_id: string;
  amount: number;
  method: string;
  status: PaymentStatus;
  created_at: string;
}

export function getAllPayments(limit = 100, offset = 0) {
  return apiFetch<AdminPayment[]>(
    `/admin/payments?limit=${limit}&offset=${offset}`,
  );
}

export interface AdminPaymentsSummaryFilters extends PaymentsSummaryFilters {
  /** Filtrar por empresa (UUID). */
  company_id?: string;
  /** Filtrar por status do pagamento. */
  status?: PaymentStatus;
}

/**
 * Resumo financeiro global da plataforma, já agregado pelo backend
 * (recebido/pendente/falhado/cancelado + quebra por dia e por mês).
 * Aceita filtros de período, método, empresa e status.
 */
export function getAdminPaymentsSummary(
  filters: AdminPaymentsSummaryFilters = {},
) {
  return apiFetch<PaymentsSummary>(
    `/admin/payments/summary${toQueryString(filters)}`,
  );
}

// Excepção operacional — usar quando o webhook do gateway falha. Não expor a operadores comuns.
export function confirmPaymentManually(paymentId: string) {
  return apiFetch<{ payment_id: string; status: "confirmed" }>(
    "/payments/actions/confirm",
    {
      method: "POST",
      body: { payment_id: paymentId },
    },
  );
}

export interface AuditLogEntry {
  id: string;
  event_type: string;
  actor_id: string;
  description: string;
  occurred_at: string;
}

// Devolve sempre só os últimos 50 registos — sem paginação.
export function getAuditLog() {
  return apiFetch<AuditLogEntry[]>("/admin/audit-log");
}

export interface GlobalRoleSummary {
  id: string;
  nome: string;
  descricao: string;
  empresa_id: null;
  is_system: boolean;
  permission_count: number;
}

export function getGlobalRoles() {
  return apiFetch<GlobalRoleSummary[]>("/admin/roles");
}

export interface PlatformPermission {
  id: string;
  codigo: string;
  descricao: string;
  grupo: string;
  is_system: boolean;
}

export function getAllPermissions() {
  return apiFetch<PlatformPermission[]>("/admin/permissions");
}

// Aqui o par user_id/role_id vai no CORPO JSON — ao contrário de
// /companies/roles/assign, que usa query string. Ver lib/api/companies.ts.
export function assignGlobalRole(userId: string, roleId: string) {
  return apiFetch<{ detail: string }>("/admin/roles/assign", {
    method: "POST",
    body: { user_id: userId, role_id: roleId },
  });
}

export interface AdminUserRole {
  id: string;
  nome: string;
}

export function getUserRoles(userId: string) {
  return apiFetch<AdminUserRole[]>(`/admin/users/${userId}/roles`);
}

export interface CreateGlobalRoleInput {
  nome: string;
  descricao: string;
}

export function createGlobalRole(input: CreateGlobalRoleInput) {
  return apiFetch<{ id: string; nome: string; descricao: string }>(
    "/admin/roles",
    {
      method: "POST",
      body: input,
    },
  );
}

export interface GlobalRoleDetail {
  id: string;
  nome: string;
  descricao: string;
  empresa_id: null;
  is_system: boolean;
  permissions: PlatformPermission[];
}

export function getGlobalRole(roleId: string) {
  return apiFetch<GlobalRoleDetail>(`/admin/roles/${roleId}`);
}

export function deleteGlobalRole(roleId: string) {
  return apiFetch<{ detail: string }>(`/admin/roles/${roleId}`, {
    method: "DELETE",
  });
}

export function updateGlobalRolePermissions(
  roleId: string,
  permissionCodes: string[],
) {
  return apiFetch<{ id: string; permission_count: number }>(
    `/admin/roles/${roleId}/permissions`,
    {
      method: "PATCH",
      body: { permission_codes: permissionCodes },
    },
  );
}

export function removeGlobalRoleUser(roleId: string, userId: string) {
  return apiFetch<{ detail: string }>(
    `/admin/roles/${roleId}/users/${userId}`,
    { method: "DELETE" },
  );
}

export interface MyPermissions {
  user_id: string;
  permissions: string[];
}

/**
 * Variante ADMIN de `/auth/my-permissions` — mesmo contrato. A app lê as
 * permissões da sessão via `getMyPermissions()` (`lib/api/auth.ts`), usado por
 * `lib/auth/session.ts`; este existe só por paridade com o catálogo da API.
 */
export function getAdminMyPermissions() {
  return apiFetch<MyPermissions>("/admin/me/permissions");
}
