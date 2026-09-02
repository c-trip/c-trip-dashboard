"use server";

import { z } from "zod";

import {
  recordBoarding,
  validateQr,
  type BoardingRecordResponse,
  type ValidateQrResponse,
} from "@/lib/api/operator";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { actionErrorState, type ActionState } from "@/lib/forms/action-state";

export interface ValidateActionState extends ActionState {
  result?: ValidateQrResponse;
  qrHash?: string;
}

export interface RecordActionState extends ActionState {
  record?: BoardingRecordResponse;
}

const hashSchema = z.object({
  qr_hash: z
    .string()
    .trim()
    .min(1, { message: "Introduz ou lê o código do QR." }),
  schedule_id: z.string().trim().optional().or(z.literal("")),
});

export async function validateAction(
  _prevState: ValidateActionState,
  formData: FormData,
): Promise<ValidateActionState> {
  await requirePermission(PERMISSIONS.bookingSell);

  const parsed = hashSchema.safeParse({
    qr_hash: formData.get("qr_hash"),
    schedule_id: formData.get("schedule_id"),
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    const result = await validateQr(
      parsed.data.qr_hash,
      parsed.data.schedule_id || undefined,
    );
    return { success: true, result, qrHash: parsed.data.qr_hash };
  } catch (error) {
    return actionErrorState(error);
  }
}

export async function recordAction(
  qrHash: string,
  scheduleId: string | undefined,
): Promise<RecordActionState> {
  await requirePermission(PERMISSIONS.bookingSell);

  try {
    const record = await recordBoarding(qrHash, scheduleId);
    return { success: true, record };
  } catch (error) {
    return actionErrorState(error);
  }
}
