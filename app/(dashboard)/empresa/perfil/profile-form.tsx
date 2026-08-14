"use client";

import { useActionState } from "react";

import { updateProfileAction } from "./actions";
import { FormError, FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { initialActionState } from "@/lib/forms/action-state";

export function ProfileForm() {
  const [state, action, pending] = useActionState(updateProfileAction, initialActionState);

  return (
    <form action={action} className="flex flex-col gap-4">
      <FormError message={state.formError} />
      <FormField htmlFor="name" label="Nome" error={state.fieldErrors?.name}>
        <Input id="name" name="name" placeholder="Deixa em branco para não alterar" />
      </FormField>
      <FormField htmlFor="email" label="Email" error={state.fieldErrors?.email}>
        <Input id="email" name="email" type="email" placeholder="Deixa em branco para não alterar" />
      </FormField>
      <FormField htmlFor="phone" label="Telefone" error={state.fieldErrors?.phone}>
        <Input id="phone" name="phone" placeholder="Deixa em branco para não alterar" />
      </FormField>
      <FormField htmlFor="address" label="Morada" error={state.fieldErrors?.address}>
        <Input id="address" name="address" placeholder="Deixa em branco para não alterar" />
      </FormField>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "A guardar…" : "Guardar alterações"}
        </Button>
        {state.success ? <p className="text-sm text-emerald-600 dark:text-emerald-400">Guardado.</p> : null}
      </div>
    </form>
  );
}
