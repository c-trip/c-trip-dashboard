"use client";

import { useActionState } from "react";

import { deleteRoleAction, updateRolePermissionsAction } from "../actions";
import { FormError } from "@/components/forms/form-field";
import { PermissionChecklist } from "@/components/forms/permission-checklist";
import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { PlatformPermission } from "@/lib/api/admin";
import { initialActionState } from "@/lib/forms/action-state";

interface EditRoleFormProps {
  roleId: string;
  roleName: string;
  isSystem: boolean;
  currentPermissions: string[];
  allPermissions: PlatformPermission[];
}

export function EditRoleForm({
  roleId,
  roleName,
  isSystem,
  currentPermissions,
  allPermissions,
}: EditRoleFormProps) {
  const [state, action, pending] = useActionState(
    updateRolePermissionsAction.bind(null, roleId),
    initialActionState
  );

  return (
    <Card>
      <CardContent>
        <form action={action} className="flex flex-col gap-5">
          <FormError message={state.formError} />
          {state.success ? (
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
              Permissões actualizadas com sucesso.
            </div>
          ) : null}
          <PermissionChecklist
            name="permission_codes"
            options={allPermissions}
            defaultSelected={currentPermissions}
          />
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={pending || isSystem}>
              {pending ? "A guardar\u2026" : "Guardar permissões"}
            </Button>
            {!isSystem ? (
              <ConfirmDialog
                trigger={
                  <Button type="button" variant="destructive">
                    Eliminar role
                  </Button>
                }
                title={`Eliminar a role "${roleName}"?`}
                description="Esta acção é irreversível. Todos os utilizadores com esta role perderão as permissões associadas."
                onConfirm={() => deleteRoleAction(roleId)}
              />
            ) : null}
          </div>
          {isSystem ? (
            <p className="text-xs text-muted-foreground">
              Roles de sistema não podem ser editadas nem eliminadas.
            </p>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
