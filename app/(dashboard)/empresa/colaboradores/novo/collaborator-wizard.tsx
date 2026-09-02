"use client";

import { useActionState, useState } from "react";

import { createCollaboratorAction } from "../actions";
import { PermissionChecklist } from "@/components/forms/permission-checklist";
import { FormError, FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Step, Stepper } from "@/components/ui/stepper";
import type { CompanyPermission } from "@/lib/api/companies";
import { initialActionState } from "@/lib/forms/action-state";

export function CollaboratorWizard({
  permissions,
  canAssignPermissions,
}: {
  permissions: CompanyPermission[];
  canAssignPermissions: boolean;
}) {
  const [state, action, pending] = useActionState(
    createCollaboratorAction,
    initialActionState,
  );
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({ name: "", email: "", password: "" });
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
          {perms.map((codigo) => (
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
                  <p className="text-sm text-muted-foreground">
                    Escolhe o que este colaborador pode fazer. Podes ajustar
                    mais tarde na página dele.
                  </p>
                  <PermissionChecklist
                    options={permissions}
                    value={perms}
                    onChange={setPerms}
                  />
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
