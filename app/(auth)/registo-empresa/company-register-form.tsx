"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import { registerCompanyAction } from "./actions";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { initialActionState } from "@/lib/forms/action-state";

export function CompanyRegisterForm() {
  const [state, action, pending] = useActionState(registerCompanyAction, initialActionState);

  useEffect(() => {
    if (state.formError) toast.error(state.formError);
  }, [state.formError]);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <FormField htmlFor="name" label="Nome da empresa" error={state.fieldErrors?.name} className="col-span-2">
          <Input id="name" name="name" required />
        </FormField>
        <FormField htmlFor="email" label="Email" error={state.fieldErrors?.email} className="col-span-2">
          <Input id="email" name="email" type="email" required />
        </FormField>
        <FormField htmlFor="password" label="Password" error={state.fieldErrors?.password} className="col-span-2">
          <Input id="password" name="password" type="password" required />
        </FormField>
        <FormField htmlFor="phone" label="Telefone" error={state.fieldErrors?.phone}>
          <Input id="phone" name="phone" required />
        </FormField>
        <FormField htmlFor="nif" label="NIF" error={state.fieldErrors?.nif}>
          <Input id="nif" name="nif" required />
        </FormField>
        <FormField htmlFor="address" label="Morada" error={state.fieldErrors?.address} className="col-span-2">
          <Input id="address" name="address" required />
        </FormField>
        <FormField
          htmlFor="responsible_name"
          label="Nome do responsável"
          error={state.fieldErrors?.responsible_name}
          className="col-span-2"
        >
          <Input id="responsible_name" name="responsible_name" required />
        </FormField>
        <FormField
          htmlFor="responsible_id_document"
          label="Documento de identificação do responsável"
          error={state.fieldErrors?.responsible_id_document}
          className="col-span-2"
        >
          <Input id="responsible_id_document" name="responsible_id_document" required />
        </FormField>
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "A criar…" : "Registar empresa"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Já tens conta?{" "}
        <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
          Entrar
        </Link>
      </p>
    </form>
  );
}
