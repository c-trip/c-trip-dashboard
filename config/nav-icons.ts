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
