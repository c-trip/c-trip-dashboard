"use client";

import { useActionState, useTransition } from "react";

import { assignCollaboratorRoleAction, removeCollaboratorRoleAction } from "./actions";
import { FormError, FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { CompanyRoleSummary } from "@/lib/api/companies";
import { initialActionState } from "@/lib/forms/action-state";

const selectClass =
  "flex h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

interface CollaboratorRolesProps {
  userId: string;
  currentRoles: CompanyRoleSummary[];
  assignableRoles: CompanyRoleSummary[];
}

export function CollaboratorRoles({ userId, currentRoles, assignableRoles }: CollaboratorRolesProps) {
  const assign = assignCollaboratorRoleAction.bind(null, userId);
  const [state, action, pending] = useActionState(assign, initialActionState);
  const [isRemoving, startRemoving] = useTransition();

  const currentIds = new Set(currentRoles.map((role) => role.id));
  const options = assignableRoles.filter((role) => !currentIds.has(role.id));

  return (
    <Card>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-foreground">Roles atribuídas</h3>
          {currentRoles.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma role atribuída.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {currentRoles.map((role) => (
                <li
                  key={role.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"
                >
                  <div>
                    <span className="text-sm font-medium">{role.nome}</span>
                    {role.descricao ? (
                      <span className="ml-2 text-xs text-muted-foreground">{role.descricao}</span>
                    ) : null}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isRemoving}
                    onClick={() =>
                      startRemoving(async () => {
                        await removeCollaboratorRoleAction(userId, role.id);
                      })
                    }
                  >
                    Remover
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {options.length > 0 ? (
          <form action={action} className="flex flex-wrap items-end gap-3">
            <FormError message={state.formError} />
            <FormField
              htmlFor="role_id"
              label="Atribuir role"
              error={state.fieldErrors?.role_id}
              className="min-w-48 flex-1"
            >
              <select id="role_id" name="role_id" required defaultValue="" className={selectClass}>
                <option value="" disabled>
                  Escolhe uma role
                </option>
                {options.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.nome}
                    {role.empresa_id === null ? " (sistema)" : ""}
                  </option>
                ))}
              </select>
            </FormField>
            <Button type="submit" disabled={pending}>
              {pending ? "A atribuir…" : "Atribuir"}
            </Button>
            {state.success ? (
              <p className="w-full text-sm font-medium text-emerald-600 dark:text-emerald-400">
                Role atribuída.
              </p>
            ) : null}
          </form>
        ) : (
          <p className="text-xs text-muted-foreground">
            Não há mais roles disponíveis para atribuir a este colaborador.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
