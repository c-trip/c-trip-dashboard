// Os códigos de permissão são definidos em runtime pelo backend
// (GET /companies/permissions para o Gestor, GET /admin/permissions para o Admin),
// por isso este ficheiro não é um enum fechado — é só a lista dos códigos que a
// navegação e os guards deste dashboard referenciam directamente. Mantém-na
// alinhada com `config/nav.ts` e com os `requirePermission(...)` de cada página.

export const PERMISSIONS = {
  companyUpdateProfile: "company:update_profile",
  companyReadUsers: "company:read_users",
  companyCreateUser: "company:create_user",
  companyDeleteUser: "company:delete_user",
  companyRoleRead: "company:role_read",
  companyRoleAssign: "company:role_assign",
  routeRead: "route:read",
  routeCreate: "route:create",
  routeAddStop: "route:add_stop",
  routeActivate: "route:activate",
  routeDeactivate: "route:deactivate",
  scheduleRead: "schedule:read",
  scheduleCreate: "schedule:create",
  scheduleUpdate: "schedule:update",
  scheduleCancel: "schedule:cancel",
  busRead: "bus:read",
  busCreate: "bus:create",
  busUpdate: "bus:update",
  driverRead: "driver:read",
  driverCreate: "driver:create",
  driverUpdate: "driver:update",
  taskCreate: "task:create",
  paymentReadCompany: "payment:read_company",
  paymentReadAll: "payment:read_all",
  paymentConfirm: "payment:confirm",
  adminCompanyPending: "admin:company_pending",
  adminCompanyReadAll: "admin:company_read_all",
  adminCompanyApprove: "admin:company_approve",
  adminCompanyReject: "admin:company_reject",
  adminCompanySuspend: "admin:company_suspend",
  adminUserReadAll: "admin:user_read_all",
  adminAuditRead: "admin:audit_read",
  adminPermissionRead: "admin:permission_read",
  adminRoleRead: "admin:role_read",
  adminRoleCreate: "admin:role_create",
  adminRoleUpdate: "admin:role_update",
  adminRoleDelete: "admin:role_delete",
  adminRoleAssign: "admin:role_assign",
} as const;

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
