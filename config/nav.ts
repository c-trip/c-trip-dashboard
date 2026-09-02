import { PERMISSIONS } from "@/lib/auth/permissions";

export type IconName =
  | "dashboard"
  | "route"
  | "calendar"
  | "bus"
  | "users"
  | "userCog"
  | "creditCard"
  | "building"
  | "clipboard"
  | "shield"
  | "ticket"
  | "scan"
  | "report";

export interface NavItem {
  href: string;
  label: string;
  icon: IconName;
  /** Omitido = sempre visível para quem já tem acesso à secção (ex.: visão geral). */
  permission?: string;
}

export const empresaNav: NavItem[] = [
  { href: "/empresa", label: "Visão geral", icon: "dashboard" },
  {
    href: "/empresa/rotas",
    label: "Rotas",
    icon: "route",
    permission: PERMISSIONS.routeRead,
  },
  {
    href: "/empresa/horarios",
    label: "Horários",
    icon: "calendar",
    permission: PERMISSIONS.scheduleRead,
  },
  {
    href: "/empresa/frota/autocarros",
    label: "Autocarros",
    icon: "bus",
    permission: PERMISSIONS.busRead,
  },
  {
    href: "/empresa/frota/motoristas",
    label: "Motoristas",
    icon: "users",
    permission: PERMISSIONS.driverRead,
  },
  {
    href: "/empresa/frota/tarefas",
    label: "Tarefas",
    icon: "clipboard",
    permission: PERMISSIONS.taskCreate,
  },
  {
    href: "/empresa/balcao",
    label: "Balcão",
    icon: "ticket",
    permission: PERMISSIONS.bookingSell,
  },
  {
    href: "/empresa/embarque",
    label: "Embarque",
    icon: "scan",
    permission: PERMISSIONS.boardingValidate,
  },
  {
    href: "/empresa/colaboradores",
    label: "Colaboradores",
    icon: "userCog",
    permission: PERMISSIONS.companyReadUsers,
  },
  {
    href: "/empresa/pagamentos",
    label: "Pagamentos",
    icon: "creditCard",
    permission: PERMISSIONS.paymentReadCompany,
  },
  {
    href: "/empresa/relatorios",
    label: "Fluxo de caixa",
    icon: "report",
    permission: PERMISSIONS.financeReportDaily,
  },
];

export const adminNav: NavItem[] = [
  { href: "/admin", label: "Visão geral", icon: "dashboard" },
  {
    href: "/admin/empresas",
    label: "Empresas",
    icon: "building",
    permission: PERMISSIONS.adminCompanyReadAll,
  },
  {
    href: "/admin/utilizadores",
    label: "Utilizadores",
    icon: "users",
    permission: PERMISSIONS.adminUserReadAll,
  },
  {
    href: "/admin/pagamentos",
    label: "Pagamentos",
    icon: "creditCard",
    permission: PERMISSIONS.paymentReadAll,
  },
  {
    href: "/admin/relatorios",
    label: "Fluxo de caixa",
    icon: "report",
    permission: PERMISSIONS.paymentReadAll,
  },
  {
    href: "/admin/auditoria",
    label: "Auditoria",
    icon: "clipboard",
    permission: PERMISSIONS.adminAuditRead,
  },
  {
    href: "/admin/configuracoes/roles",
    label: "Roles & permissões",
    icon: "shield",
    permission: PERMISSIONS.adminRoleRead,
  },
];
