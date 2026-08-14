import {
  IconBuilding,
  IconBus,
  IconCalendarEvent,
  IconClipboardList,
  IconCreditCard,
  IconLayoutDashboard,
  IconRoute,
  IconShieldLock,
  IconUserCog,
  IconUsers,
} from "@tabler/icons-react";
import type { TablerIcon } from "@tabler/icons-react";

import type { IconName } from "@/config/nav";

// Único sítio que liga a chave `IconName` (dado plano) ao componente do ícone
// de facto — importado sempre do lado que renderiza (Server ou Client
// Component), nunca passado como prop entre os dois.
export const NAV_ICONS: Record<IconName, TablerIcon> = {
  dashboard: IconLayoutDashboard,
  route: IconRoute,
  calendar: IconCalendarEvent,
  bus: IconBus,
  users: IconUsers,
  userCog: IconUserCog,
  creditCard: IconCreditCard,
  building: IconBuilding,
  clipboard: IconClipboardList,
  shield: IconShieldLock,
};
