"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createTask, updateTaskStatus } from "@/lib/api/fleet";
import type { TaskStatus } from "@/lib/api/types";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requireAuth, requirePermission } from "@/lib/auth/session";
import { actionErrorState, type ActionState } from "@/lib/forms/action-state";

const createSchema = z.object({
  assigned_to: z.string().uuid({ message: "Escolhe a quem atribuir." }),
  title: z.string().min(2, { message: "Mínimo 2 caracteres." }),
  description: z.string().min(2, { message: "Descreve a tarefa." }),
});

export async function createTaskAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requirePermission(PERMISSIONS.taskCreate);

  const parsed = createSchema.safeParse({
    assigned_to: formData.get("assigned_to"),
    title: formData.get("title"),
    description: formData.get("description"),
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await createTask(parsed.data);
  } catch (error) {
    return actionErrorState(error);
  }

  revalidatePath("/empresa/frota/tarefas");
  return { success: true };
}

const STATUSES: TaskStatus[] = ["pending", "in_progress", "done"];

export async function updateTaskStatusAction(taskId: string, status: string) {
  await requireAuth();
  if (!STATUSES.includes(status as TaskStatus)) {
    return { formError: "Estado inválido." } as ActionState;
  }
  try {
    await updateTaskStatus(taskId, status as TaskStatus);
  } catch (error) {
    return actionErrorState(error);
  }
  revalidatePath("/empresa/frota/tarefas");
  return { success: true } as ActionState;
}
