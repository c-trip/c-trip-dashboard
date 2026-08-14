import { apiFetch } from "@/lib/api/client";
import type { CompanyStatus } from "@/lib/api/types";

export interface RegisterCompanyInput {
  name: string;
  email: string;
  password: string;
  phone: string;
  nif: string;
  address: string;
  responsible_name: string;
  responsible_id_document: string;
  company_type?: string;
}

export interface RegisteredCompany {
  id: string;
  name: string;
  email: string;
  phone: string;
  nif: string;
  address: string;
  responsible_name: string;
  company_type: string;
  status: CompanyStatus;
}

export function registerCompany(input: RegisterCompanyInput) {
  return apiFetch<RegisteredCompany>("/companies/register", { method: "POST", body: input, auth: false });
}

export interface CompanyProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface UpdateCompanyProfileInput {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export function updateCompanyProfile(input: UpdateCompanyProfileInput) {
  return apiFetch<CompanyProfile>("/companies/profile", { method: "PATCH", body: input });
}

export interface CompanyUser {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
}

export function getCompanyUsers() {
  return apiFetch<CompanyUser[]>("/companies/users");
}

export interface CreateCollaboratorInput {
  email: string;
  name: string;
  password: string;
}

export function createCollaborator(input: CreateCollaboratorInput) {
  return apiFetch<CompanyUser>("/companies/users", { method: "POST", body: input });
}

export function removeCollaborator(userId: string) {
  return apiFetch<{ id: string; is_active: boolean }>(`/companies/users/${userId}`, { method: "DELETE" });
}

export interface CompanyPermission {
  id: string;
  codigo: string;
  descricao: string;
  grupo: string;
  is_system: boolean;
}

export function getAssignableCompanyPermissions() {
  return apiFetch<CompanyPermission[]>("/companies/permissions");
}

export interface CollaboratorRole {
  id: string;
  nome: string;
  descricao: string;
  empresa_id?: string;
  is_system: boolean;
  permissions: CompanyPermission[];
}

/**
 * SUBSTITUI a lista inteira de permissões do colaborador — não é incremental.
 * Se o formulário parte de checkboxes pré-marcadas (via `getCollaboratorRoles`),
 * o array enviado aqui tem de ser a lista completa desejada, não só o que mudou.
 * Ver Docs/C-Trip_Guia_Frontend.pdf, "Definir Permissões do Colaborador".
 */
export function replaceCollaboratorPermissions(userId: string, permissionCodes: string[]) {
  return apiFetch<CollaboratorRole>(`/companies/users/${userId}/permissions`, {
    method: "POST",
    body: { permission_codes: permissionCodes },
  });
}

export interface CompanyRoleSummary {
  id: string;
  nome: string;
  descricao: string;
  empresa_id: string | null; // null = role global do sistema (ex.: "gestor")
  is_system: boolean;
  permission_count: number;
}

export function getCompanyRoles() {
  return apiFetch<CompanyRoleSummary[]>("/companies/roles");
}

/**
 * Gotcha do backend: ao contrário de quase todos os outros POST da API, este usa
 * QUERY STRING, não corpo JSON. Confirmado no guia de integração, secção "Empresa".
 */
export function assignCompanyRole(userId: string, roleId: string) {
  const params = new URLSearchParams({ user_id: userId, role_id: roleId });
  return apiFetch<{ detail: string }>(`/companies/roles/assign?${params.toString()}`, { method: "POST" });
}

export function removeCompanyRole(roleId: string, userId: string) {
  return apiFetch<{ detail: string }>(`/companies/roles/${roleId}/users/${userId}`, { method: "DELETE" });
}

export interface CollaboratorRoles {
  user_id: string;
  user_name: string;
  user_email: string;
  roles: CompanyRoleSummary[];
}

export function getCollaboratorRoles(userId: string) {
  return apiFetch<CollaboratorRoles>(`/companies/users/${userId}/roles`);
}
