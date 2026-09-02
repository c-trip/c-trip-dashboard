import {
  IoBusinessOutline,
  IoBusOutline,
  IoCalendarOutline,
  IoCardOutline,
  IoClipboardOutline,
  IoMapOutline,
  IoPeopleOutline,
  IoPersonCircleOutline,
  IoQrCodeOutline,
  IoScanOutline,
  IoShieldCheckmarkOutline,
  IoSpeedometerOutline,
} from "react-icons/io5";
import type { IconType } from "react-icons";

import type { IconName } from "@/config/nav";

export const NAV_ICONS: Record<IconName, IconType> = {
  dashboard: IoSpeedometerOutline,
  route: IoMapOutline,
  calendar: IoCalendarOutline,
  bus: IoBusOutline,
  users: IoPeopleOutline,
  userCog: IoPersonCircleOutline,
  creditCard: IoCardOutline,
  building: IoBusinessOutline,
  clipboard: IoClipboardOutline,
  shield: IoShieldCheckmarkOutline,
  ticket: IoQrCodeOutline,
  scan: IoScanOutline,
};
