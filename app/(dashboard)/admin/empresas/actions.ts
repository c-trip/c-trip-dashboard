"use server";

import { revalidatePath } from "next/cache";

import { moderateCompany, type CompanyModerationAction } from "@/lib/api/admin";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";

const PERMISSION_BY_ACTION: Record<CompanyModerationAction, string> = {
  approve: PERMISSIONS.adminCompanyApprove,
  reject: PERMISSIONS.adminCompanyReject,
  suspend: PERMISSIONS.adminCompanySuspend,
};

export async function moderateCompanyAction(companyId: string, action: CompanyModerationAction) {
  await requirePermission(PERMISSION_BY_ACTION[action]);
  await moderateCompany(companyId, action);
  revalidatePath("/admin/empresas");
  revalidatePath(`/admin/empresas/${companyId}`);
}
