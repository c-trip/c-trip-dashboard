"use server";

import { revalidatePath } from "next/cache";

import { updateBus, type UpdateBusInput } from "@/lib/api/fleet";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { actionErrorState, type ActionState } from "@/lib/forms/action-state";

export async function updateBusStatusAction(busId: string, status: UpdateBusInput["status"]) {
  await requirePermission(PERMISSIONS.busUpdate);
  try {
    await updateBus(busId, { status });
  } catch (error) {
    return actionErrorState(error);
  }
  revalidatePath("/empresa/frota/autocarros");
  return { success: true } as ActionState;
}
