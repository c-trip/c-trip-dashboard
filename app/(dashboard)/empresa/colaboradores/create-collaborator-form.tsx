"use client";

import { useActionState, useEffect, useRef } from "react";

import { createCollaboratorAction } from "./actions";
import { FormError, FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { initialActionState } from "@/lib/forms/action-state";

export function CreateCollaboratorForm() {
  const [state, action, pending] = useActionState(createCollaboratorAction, initialActionState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-3 rounded-xl border border-border p-4">
      <FormError message={state.formError} />
      <div className="flex flex-wrap items-end gap-3">
        <FormField htmlFor="name" label="Nome" error={state.fieldErrors?.name} className="min-w-40 flex-1">
          <Input id="name" name="name" required />
        </FormField>
        <FormField htmlFor="email" label="Email" error={state.fieldErrors?.email} className="min-w-48 flex-1">
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
        <Button type="submit" disabled={pending}>
          {pending ? "A criar…" : "Adicionar colaborador"}
        </Button>
      </div>
      {state.success ? (
        <p className="text-sm text-emerald-600 dark:text-emerald-400">
          Colaborador criado sem nenhuma permissão ainda — define-as já ao lado do nome na lista.
        </p>
      ) : null}
    </form>
  );
}
