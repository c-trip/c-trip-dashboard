"use client";

import { useActionState, useEffect, useRef } from "react";

import { createCollaboratorAction } from "./actions";
import { FormError, FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { CompanyRoleSummary } from "@/lib/api/companies";
import { initialActionState } from "@/lib/forms/action-state";

const selectClass =
  "flex h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

interface CreateCollaboratorFormProps {
  /** Roles atribuíveis. Vazio se o utilizador não puder atribuir acesso. */
  roles: CompanyRoleSummary[];
  canAssignAccess: boolean;
}

export function CreateCollaboratorForm({
  roles,
  canAssignAccess,
}: CreateCollaboratorFormProps) {
  const [state, action, pending] = useActionState(
    createCollaboratorAction,
    initialActionState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <Card>
      <CardContent>
        <form ref={formRef} action={action} className="flex flex-col gap-4">
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
            {canAssignAccess && roles.length > 0 ? (
              <FormField
                htmlFor="role_id"
                label="Acesso"
                error={state.fieldErrors?.role_id}
                hint="Podes afinar depois em Permissões."
                className="min-w-44 flex-1"
              >
                <select
                  id="role_id"
                  name="role_id"
                  defaultValue=""
                  className={selectClass}
                >
                  <option value="">Sem acesso</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.nome}
                    </option>
                  ))}
                </select>
              </FormField>
            ) : null}
          </div>

          <Button type="submit" disabled={pending} className="w-fit">
            {pending ? "A criar…" : "Adicionar colaborador"}
          </Button>

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
