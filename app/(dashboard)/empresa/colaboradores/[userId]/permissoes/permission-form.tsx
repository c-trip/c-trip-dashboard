"use client";

import { useActionState } from "react";

import { replacePermissionsAction } from "./actions";
import { PermissionChecklist } from "@/components/forms/permission-checklist";
import { FormError } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import type { CompanyPermission } from "@/lib/api/companies";
import { initialActionState } from "@/lib/forms/action-state";

interface PermissionFormProps {
  userId: string;
  options: CompanyPermission[];
  defaultSelected: string[];
}

export function PermissionForm({
  userId,
  options,
  defaultSelected,
}: PermissionFormProps) {
  const boundAction = replacePermissionsAction.bind(null, userId);
  const [state, action, pending] = useActionState(
    boundAction,
    initialActionState,
  );

  return (
    <form action={action} className="flex flex-col gap-4">
      <FormError message={state.formError} />
      <PermissionChecklist
        name="permission_codes"
        options={options}
        defaultSelected={defaultSelected}
      />
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "A guardar…" : "Guardar permissões"}
        </Button>
        {state.success ? (
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            Guardado.
          </p>
        ) : null}
      </div>
    </form>
  );
}
