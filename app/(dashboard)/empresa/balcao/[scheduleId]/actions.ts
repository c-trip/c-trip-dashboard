"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { operatorSell, type OperatorSaleResponse } from "@/lib/api/operator";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { actionErrorState, type ActionState } from "@/lib/forms/action-state";

export interface SellActionState extends ActionState {
  sale?: OperatorSaleResponse;
  /** Dados que a resposta da API não devolve mas o talão precisa. */
  meta?: {
    price: number;
    method: "cash" | "pos" | "multicaixa_express";
    phone?: string;
    doc?: string;
  };
}

const sellSchema = z.object({
  seat_number: z.coerce
    .number()
    .int()
    .positive({ message: "Escolhe um lugar." }),
  passenger_name: z
    .string()
    .trim()
    .min(2, { message: "Introduz o nome do passageiro." }),
  passenger_phone: z.string().trim().optional().or(z.literal("")),
  passenger_id_doc: z.string().trim().optional().or(z.literal("")),
  total_price: z.coerce
    .number()
    .positive({ message: "O valor tem de ser maior que zero." }),
  payment_method: z.enum(["cash", "pos", "multicaixa_express"]),
});

export async function sellAction(
  scheduleId: string,
  _prevState: SellActionState,
  formData: FormData,
): Promise<SellActionState> {
  await requirePermission(PERMISSIONS.bookingSell);

  const parsed = sellSchema.safeParse({
    seat_number: formData.get("seat_number"),
    passenger_name: formData.get("passenger_name"),
    passenger_phone: formData.get("passenger_phone"),
    passenger_id_doc: formData.get("passenger_id_doc"),
    total_price: formData.get("total_price"),
    payment_method: formData.get("payment_method"),
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  let sale: OperatorSaleResponse;
  try {
    sale = await operatorSell({
      schedule_id: scheduleId,
      seat_number: parsed.data.seat_number,
      passenger_name: parsed.data.passenger_name,
      passenger_phone: parsed.data.passenger_phone || undefined,
      passenger_id_doc: parsed.data.passenger_id_doc || undefined,
      total_price: parsed.data.total_price,
      payment_method: parsed.data.payment_method,
    });
  } catch (error) {
    return actionErrorState(error);
  }

  revalidatePath(`/empresa/balcao/${scheduleId}`);
  return {
    success: true,
    sale,
    meta: {
      price: parsed.data.total_price,
      method: parsed.data.payment_method,
      phone: parsed.data.passenger_phone || undefined,
      doc: parsed.data.passenger_id_doc || undefined,
    },
  };
}
