"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createBus, updateBus, type UpdateBusInput } from "@/lib/api/fleet";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { actionErrorState, type ActionState } from "@/lib/forms/action-state";

const createSchema = z.object({
  model: z.string().min(2, { message: "Mínimo 2 caracteres." }),
  license_plate: z.string().min(2, { message: "Introduz a matrícula." }),
  total_rows: z.coerce.number().int().positive({ message: "O nº de filas tem de ser maior que zero." }),
  seats_per_row: z.coerce
    .number()
    .int()
    .positive({ message: "Os lugares por fila têm de ser maior que zero." }),
});

export async function createBusAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requirePermission(PERMISSIONS.busCreate);

  const parsed = createSchema.safeParse({
    model: formData.get("model"),
    license_plate: formData.get("license_plate"),
    total_rows: formData.get("total_rows"),
    seats_per_row: formData.get("seats_per_row"),
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await createBus(parsed.data);
  } catch (error) {
    return actionErrorState(error);
  }

  revalidatePath("/empresa/frota/autocarros");
  redirect("/empresa/frota/autocarros");
}

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
