"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createRoute } from "@/lib/api/routes";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { actionErrorState, type ActionState } from "@/lib/forms/action-state";

const schema = z.object({
  origin_city_id: z.string().uuid({ message: "Escolhe a cidade de origem." }),
  destination_city_id: z.string().uuid({ message: "Escolhe a cidade de destino." }),
  price: z.coerce.number().positive({ message: "O preço tem de ser maior que zero." }),
});

export async function createRouteAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requirePermission(PERMISSIONS.routeCreate);

  const parsed = schema.safeParse({
    origin_city_id: formData.get("origin_city_id"),
    destination_city_id: formData.get("destination_city_id"),
    price: formData.get("price"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  if (parsed.data.origin_city_id === parsed.data.destination_city_id) {
    return { formError: "Origem e destino não podem ser a mesma cidade." };
  }

  try {
    await createRoute(parsed.data);
  } catch (error) {
    return actionErrorState(error);
  }

  revalidatePath("/empresa/rotas");
  redirect("/empresa/rotas");
}
