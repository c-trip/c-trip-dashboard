import { PERMISSIONS } from "@/lib/auth/permissions";

// `icon` é uma chave em string, não o componente do ícone em si — este objecto
// precisa de ser dado simples e serializável, porque atravessa a fronteira
// Server Component (layout, que filtra por permissão) → Client Component
// (<Sidebar>, que decide o realce activo). Componentes React não podem
// atravessar essa fronteira como prop; strings podem. A resolução da chave
// para o componente real do ícone acontece em config/nav-icons.ts, já do lado
// que efectivamente renderiza.
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
  | "shield";

export interface NavItem {
  href: string;
  label: string;
  icon: IconName;
  /** Omitido = sempre visível para quem já tem acesso à secção (ex.: visão geral). */
  permission?: string;
}

export const empresaNav: NavItem[] = [
  { href: "/empresa", label: "Visão geral", icon: "dashboard" },
  { href: "/empresa/rotas", label: "Rotas", icon: "route", permission: PERMISSIONS.routeRead },
  { href: "/empresa/horarios", label: "Horários", icon: "calendar", permission: PERMISSIONS.scheduleRead },
  { href: "/empresa/frota/autocarros", label: "Autocarros", icon: "bus", permission: PERMISSIONS.busRead },
  {
    href: "/empresa/frota/motoristas",
    label: "Motoristas",
    icon: "users",
    permission: PERMISSIONS.driverRead,
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
