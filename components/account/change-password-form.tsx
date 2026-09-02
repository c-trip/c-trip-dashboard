"use client";

import { useActionState } from "react";

import { changePasswordAction } from "@/app/(dashboard)/_actions/account";
import { FormError, FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { initialActionState } from "@/lib/forms/action-state";

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState(
    changePasswordAction,
    initialActionState,
  );

  return (
    <Card className="max-w-md">
      <CardContent>
        <form action={action} className="flex flex-col gap-5">
          <FormError message={state.formError} />
          <FormField
            htmlFor="current_password"
            label="Palavra-passe actual"
            error={state.fieldErrors?.current_password}
          >
            <Input
              id="current_password"
              name="current_password"
              type="password"
              required
              autoComplete="current-password"
            />
          </FormField>
          <FormField
            htmlFor="new_password"
            label="Nova palavra-passe"
            error={state.fieldErrors?.new_password}
            hint="Mínimo 6 caracteres."
          >
            <Input
              id="new_password"
              name="new_password"
              type="password"
              required
              autoComplete="new-password"
            />
          </FormField>
          <FormField
            htmlFor="confirm"
            label="Confirmar nova palavra-passe"
            error={state.fieldErrors?.confirm}
          >
            <Input
              id="confirm"
              name="confirm"
              type="password"
              required
              autoComplete="new-password"
            />
          </FormField>
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? "A guardar…" : "Alterar palavra-passe"}
            </Button>
            {state.success ? (
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                Palavra-passe alterada.
              </p>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
