"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createSchedule, cancelSchedule } from "@/lib/api/schedules";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { actionErrorState, type ActionState } from "@/lib/forms/action-state";

const createSchema = z.object({
  route_id: z.string().uuid({ message: "Escolhe uma rota." }),
  bus_id: z.string().uuid({ message: "Escolhe um autocarro." }),
  driver_id: z.string().uuid({ message: "Escolhe um motorista." }),
  departure_date: z.string().min(1, { message: "Introduz a data de partida." }),
  departure_time: z.string().min(1, { message: "Introduz a hora de partida." }),
  total_seats: z.coerce.number().int().positive({ message: "O número de lugares tem de ser maior que zero." }),
  boarding_cutoff_minutes: z.coerce.number().int().nonnegative().optional(),
});

export async function createScheduleAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requirePermission(PERMISSIONS.scheduleCreate);

  const parsed = createSchema.safeParse({
    route_id: formData.get("route_id"),
    bus_id: formData.get("bus_id"),
    driver_id: formData.get("driver_id"),
    departure_date: formData.get("departure_date"),
    departure_time: formData.get("departure_time"),
    total_seats: formData.get("total_seats"),
    boarding_cutoff_minutes: formData.get("boarding_cutoff_minutes"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await createSchedule(parsed.data);
  } catch (error) {
    return actionErrorState(error);
  }

  revalidatePath("/empresa/horarios");
  redirect("/empresa/horarios");
}

export async function cancelScheduleAction(scheduleId: string) {
  await requirePermission(PERMISSIONS.scheduleCancel);
  await cancelSchedule(scheduleId);
  revalidatePath("/empresa/horarios");
}
