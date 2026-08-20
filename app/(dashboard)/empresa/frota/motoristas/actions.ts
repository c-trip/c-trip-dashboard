"use server";

import { revalidatePath } from "next/cache";

import { updateDriver } from "@/lib/api/fleet";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { actionErrorState } from "@/lib/forms/action-state";

export async function toggleDriverAvailabilityAction(driverId: string, currentAvailable: boolean) {
  await requirePermission(PERMISSIONS.driverUpdate);
  try {
    await updateDriver(driverId, { is_available: !currentAvailable });
  } catch (error) {
    return actionErrorState(error);
  }
  revalidatePath("/empresa/frota/motoristas");
  return { success: true };
}
