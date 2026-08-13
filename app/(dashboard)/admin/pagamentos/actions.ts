"use server";

import { revalidatePath } from "next/cache";

import { confirmPaymentManually } from "@/lib/api/admin";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";

export async function confirmPaymentAction(paymentId: string) {
  await requirePermission(PERMISSIONS.paymentConfirm);
  await confirmPaymentManually(paymentId);
  revalidatePath("/admin/pagamentos");
}
