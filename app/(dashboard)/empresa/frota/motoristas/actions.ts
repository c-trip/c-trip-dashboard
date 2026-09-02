"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createDriver, updateDriver } from "@/lib/api/fleet";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { actionErrorState, type ActionState } from "@/lib/forms/action-state";

const createSchema = z.object({
  user_id: z.string().uuid({ message: "Escolhe o colaborador a associar." }),
  name: z.string().min(2, { message: "Mínimo 2 caracteres." }),
  phone: z.string().trim().optional(),
});

export async function createDriverAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requirePermission(PERMISSIONS.driverCreate);

  const parsed = createSchema.safeParse({
    user_id: formData.get("user_id"),
    name: formData.get("name"),
    phone: formData.get("phone") || undefined,
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await createDriver(parsed.data);
  } catch (error) {
    return actionErrorState(error);
  }

  revalidatePath("/empresa/frota/motoristas");
  redirect("/empresa/frota/motoristas");
}

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
