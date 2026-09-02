"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { createCollaboratorAction } from "./actions";
import { PermissionChecklist } from "@/components/forms/permission-checklist";
import { FormError, FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type {
  CompanyPermission,
  CompanyRoleSummary,
} from "@/lib/api/companies";
import { initialActionState } from "@/lib/forms/action-state";

const selectClass =
  "flex h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

type AccessMode = "none" | "role" | "permissions";

interface CreateCollaboratorFormProps {
  /** Vazio se o utilizador não puder atribuir acesso. */
  roles: CompanyRoleSummary[];
  permissions: CompanyPermission[];
  canAssignAccess: boolean;
}

export function CreateCollaboratorForm({
  roles,
  permissions,
  canAssignAccess,
}: CreateCollaboratorFormProps) {
  const [state, action, pending] = useActionState(
    createCollaboratorAction,
    initialActionState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [accessMode, setAccessMode] = useState<AccessMode>("none");

  useEffect(() => {
    // Limpa os campos de identidade após criar; a escolha de "Acesso" mantém-se
    // porque quem adiciona colaboradores costuma repetir o mesmo tipo de acesso.
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  const OPTIONS: Array<{ value: AccessMode; label: string }> = [
    { value: "role", label: "Atribuir uma role" },
    { value: "permissions", label: "Escolher permissões" },
    { value: "none", label: "Sem acesso agora" },
  ];

  return (
    <Card>
      <CardContent>
        <form ref={formRef} action={action} className="flex flex-col gap-5">
          <FormError message={state.formError} />

          <div className="flex flex-wrap items-end gap-4">
            <FormField
              htmlFor="name"
              label="Nome"
              error={state.fieldErrors?.name}
              className="min-w-40 flex-1"
            >
              <Input id="name" name="name" required />
            </FormField>
            <FormField
              htmlFor="email"
              label="Email"
              error={state.fieldErrors?.email}
              className="min-w-48 flex-1"
            >
              <Input id="email" name="email" type="email" required />
            </FormField>
            <FormField
              htmlFor="password"
              label="Password provisória"
              error={state.fieldErrors?.password}
              className="min-w-40 flex-1"
            >
              <Input id="password" name="password" type="password" required />
            </FormField>
          </div>

          {canAssignAccess ? (
            <fieldset className="flex flex-col gap-3 rounded-xl border border-border p-4">
              <legend className="px-1 text-sm font-semibold text-foreground">
                Acesso
              </legend>
              <p className="text-xs text-muted-foreground">
                Definido a partir do catálogo da empresa — nunca dás mais do que
                tens.
              </p>
              {OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2.5 text-sm"
                >
                  <input
                    type="radio"
                    name="access_mode"
                    value={option.value}
                    checked={accessMode === option.value}
                    onChange={() => setAccessMode(option.value)}
                    className="size-4"
                  />
                  {option.label}
                </label>
              ))}

              {accessMode === "role" ? (
                <div className="ms-6">
                  <FormField
                    htmlFor="role_id"
                    label="Role"
                    error={state.fieldErrors?.role_id}
                  >
                    <select
                      id="role_id"
                      name="role_id"
                      defaultValue=""
                      className={selectClass}
                    >
                      <option value="" disabled>
                        Escolhe uma role
                      </option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.nome}
                          {role.empresa_id === null ? " (sistema)" : ""} ·{" "}
                          {role.permission_count} permissões
                        </option>
                      ))}
                    </select>
                  </FormField>
                  {roles.length === 0 ? (
                    <p className="mt-2 text-xs text-muted-foreground">
                      A empresa ainda não tem roles atribuíveis.
                    </p>
                  ) : null}
                </div>
              ) : null}

              {accessMode === "permissions" ? (
                <div className="ms-6">
                  {state.fieldErrors?.permission_codes ? (
                    <p className="mb-2 text-xs font-medium text-destructive">
                      {state.fieldErrors.permission_codes[0]}
                    </p>
                  ) : null}
                  <PermissionChecklist
                    name="permission_codes"
                    options={permissions}
                    defaultSelected={[]}
                  />
                </div>
              ) : null}
            </fieldset>
          ) : null}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? "A criar…" : "Adicionar colaborador"}
            </Button>
          </div>

          {state.success ? (
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
              Colaborador criado. Ajusta o acesso a qualquer momento ao lado do
              nome na lista.
            </div>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
