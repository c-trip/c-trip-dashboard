"use server";

import { reprintQr, type ReprintQrResponse } from "@/lib/api/operator";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";

export async function reprintQrAction(
  scheduleId: string,
  seatNumber: number,
): Promise<ReprintQrResponse> {
  await requirePermission(PERMISSIONS.boardingValidate);
  return reprintQr(scheduleId, seatNumber);
}
