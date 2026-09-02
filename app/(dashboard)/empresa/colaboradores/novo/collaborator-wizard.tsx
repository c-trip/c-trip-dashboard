"use client";

import { useActionState, useState } from "react";

import { createCollaboratorAction } from "../actions";
import { PermissionChecklist } from "@/components/forms/permission-checklist";
import { FormError, FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { CompanyPermission } from "@/lib/api/companies";
import { cn } from "@/lib/utils";
import { initialActionState } from "@/lib/forms/action-state";

const STEPS = ["Dados do colaborador", "Permissões"] as const;

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
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  const lastStep = canAssignPermissions ? 1 : 0;

  function validateStep1() {
    const errors: Record<string, string> = {};
    if (values.name.trim().length < 2) errors.name = "Mínimo 2 caracteres.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      errors.email = "Introduz um email válido.";
    if (values.password.length < 6) errors.password = "Mínimo 6 caracteres.";
    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  }

  const nameError = localErrors.name ?? state.fieldErrors?.name?.[0];
  const emailError = localErrors.email ?? state.fieldErrors?.email?.[0];
  const passwordError =
    localErrors.password ?? state.fieldErrors?.password?.[0];

  return (
    <Card>
      <CardContent className="flex flex-col gap-6">
        <ol className="flex items-center gap-2 text-sm">
          {STEPS.slice(0, lastStep + 1).map((label, index) => (
            <li key={label} className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-xs font-semibold",
                  index <= step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {index + 1}
              </span>
              <span
                className={
                  index === step
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                }
              >
                {label}
              </span>
              {index < lastStep ? (
                <span className="ms-1 text-muted-foreground">/</span>
              ) : null}
            </li>
          ))}
        </ol>

        <form action={action} className="flex flex-col gap-5">
          <FormError message={state.formError} />

          {/* Passo 1 — fica montado (só escondido) para os valores irem no FormData. */}
          <div className={cn("flex flex-col gap-5", step !== 0 && "hidden")}>
            <FormField
              htmlFor="name"
              label="Nome"
              error={nameError ? [nameError] : undefined}
            >
              <Input
                id="name"
                name="name"
                required
                value={values.name}
                onChange={(e) =>
                  setValues((v) => ({ ...v, name: e.target.value }))
                }
              />
            </FormField>
            <FormField
              htmlFor="email"
              label="Email"
              error={emailError ? [emailError] : undefined}
            >
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={values.email}
                onChange={(e) =>
                  setValues((v) => ({ ...v, email: e.target.value }))
                }
              />
            </FormField>
            <FormField
              htmlFor="password"
              label="Password provisória"
              hint="O colaborador deve alterá-la no primeiro acesso."
              error={passwordError ? [passwordError] : undefined}
            >
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={values.password}
                onChange={(e) =>
                  setValues((v) => ({ ...v, password: e.target.value }))
                }
              />
            </FormField>

            {lastStep === 0 ? (
              <Button type="submit" disabled={pending} className="w-fit">
                {pending ? "A criar…" : "Criar colaborador"}
              </Button>
            ) : (
              <Button
                type="button"
                className="w-fit"
                onClick={() => {
                  if (validateStep1()) setStep(1);
                }}
              >
                Continuar
              </Button>
            )}
          </div>

          {/* Passo 2 — permissões. */}
          {canAssignPermissions ? (
            <div className={cn("flex flex-col gap-5", step !== 1 && "hidden")}>
              <p className="text-sm text-muted-foreground">
                Escolhe o que este colaborador pode fazer. Podes ajustar mais
                tarde na página dele.
              </p>
              <PermissionChecklist
                name="permission_codes"
                options={permissions}
                defaultSelected={[]}
              />
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(0)}
                >
                  Voltar
                </Button>
                <Button type="submit" disabled={pending}>
                  {pending ? "A criar…" : "Criar colaborador"}
                </Button>
              </div>
            </div>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
