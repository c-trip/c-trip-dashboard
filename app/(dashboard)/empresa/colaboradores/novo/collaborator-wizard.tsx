"use client";

import { useActionState, useState } from "react";

import { createCollaboratorAction } from "../actions";
import { PermissionChecklist } from "@/components/forms/permission-checklist";
import { FormError, FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Step, Stepper } from "@/components/ui/stepper";
import type {
  CompanyPermission,
  CompanyRoleSummary,
} from "@/lib/api/companies";
import { initialActionState } from "@/lib/forms/action-state";

const selectClass =
  "flex h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function CollaboratorWizard({
  permissions,
  roles,
  canAssignPermissions,
}: {
  permissions: CompanyPermission[];
  roles: CompanyRoleSummary[];
  canAssignPermissions: boolean;
}) {
  const [state, action, pending] = useActionState(
    createCollaboratorAction,
    initialActionState,
  );
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [roleId, setRoleId] = useState("");
  const [perms, setPerms] = useState<string[]>([]);
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  const singleStep = !canAssignPermissions;

  function validateStep1() {
    const errors: Record<string, string> = {};
    if (values.name.trim().length < 2) errors.name = "Mínimo 2 caracteres.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      errors.email = "Introduz um email válido.";
    if (values.password.length < 6) errors.password = "Mínimo 6 caracteres.";
    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  }

  const err = (field: string) =>
    localErrors[field] ?? state.fieldErrors?.[field]?.[0];

  const identityFields = (
    <>
      <FormField
        htmlFor="name"
        label="Nome"
        error={err("name") ? [err("name")!] : undefined}
      >
        <Input
          id="name"
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          autoComplete="off"
        />
      </FormField>
      <FormField
        htmlFor="email"
        label="Email"
        error={err("email") ? [err("email")!] : undefined}
      >
        <Input
          id="email"
          type="email"
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          autoComplete="off"
        />
      </FormField>
      <FormField
        htmlFor="password"
        label="Password provisória"
        hint="O colaborador deve alterá-la no primeiro acesso."
        error={err("password") ? [err("password")!] : undefined}
      >
        <Input
          id="password"
          type="password"
          value={values.password}
          onChange={(e) =>
            setValues((v) => ({ ...v, password: e.target.value }))
          }
          autoComplete="new-password"
        />
      </FormField>
    </>
  );

  return (
    <Card>
      <CardContent>
        <form action={action} className="flex flex-col gap-6">
          {/* Espelho sempre presente — os valores vão no FormData a partir de qualquer passo. */}
          <input type="hidden" name="name" value={values.name} />
          <input type="hidden" name="email" value={values.email} />
          <input type="hidden" name="password" value={values.password} />
          <input type="hidden" name="role_id" value={roleId} />
          {!roleId &&
            perms.map((codigo) => (
              <input
                key={codigo}
                type="hidden"
                name="permission_codes"
                value={codigo}
              />
            ))}

          <FormError message={state.formError} />

          {singleStep ? (
            <div className="flex flex-col gap-5">
              {identityFields}
              <Button type="submit" disabled={pending} className="w-fit">
                {pending ? "A criar…" : "Criar colaborador"}
              </Button>
            </div>
          ) : (
            <>
              <Stepper
                step={step}
                labels={["Dados do colaborador", "Permissões"]}
              >
                <Step>{identityFields}</Step>
                <Step>
                  {roles.length > 0 ? (
                    <FormField
                      htmlFor="role"
                      label="Role"
                      hint="O caminho normal — traz o pacote de permissões já montado."
                    >
                      <select
                        id="role"
                        value={roleId}
                        onChange={(e) => setRoleId(e.target.value)}
                        className={selectClass}
                      >
                        <option value="">
                          Sem role (escolher permissões abaixo)
                        </option>
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.nome}
                            {role.permission_count
                              ? ` · ${role.permission_count} permissões`
                              : ""}
                          </option>
                        ))}
                      </select>
                    </FormField>
                  ) : null}

                  {roleId ? (
                    <p className="text-sm text-muted-foreground">
                      As permissões vêm da role escolhida. Podes afinar depois
                      na página do colaborador.
                    </p>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Ou marca permissões específicas. Podes ajustar mais
                        tarde na página dele.
                      </p>
                      <PermissionChecklist
                        options={permissions}
                        value={perms}
                        onChange={setPerms}
                      />
                    </>
                  )}
                </Step>
              </Stepper>

              <div className="flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={step === 0}
                  onClick={() => setStep(0)}
                >
                  Voltar
                </Button>
                {step === 0 ? (
                  <Button
                    type="button"
                    onClick={() => {
                      if (validateStep1()) setStep(1);
                    }}
                  >
                    Continuar
                  </Button>
                ) : (
                  <Button type="submit" disabled={pending}>
                    {pending ? "A criar…" : "Criar colaborador"}
                  </Button>
                )}
              </div>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
