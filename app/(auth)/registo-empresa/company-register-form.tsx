"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import {
  IconBuilding,
  IconId,
  IconIdBadge,
  IconMail,
  IconMapPin,
  IconUser,
} from "@tabler/icons-react";
import toast from "react-hot-toast";

import { registerCompanyAction } from "./actions";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { IconInput } from "@/components/ui/icon-input";
import { PhoneInput } from "@/components/ui/phone-input";
import { initialActionState } from "@/lib/forms/action-state";

export function CompanyRegisterForm() {
  const [state, action, pending] = useActionState(
    registerCompanyAction,
    initialActionState,
  );

  useEffect(() => {
    if (state.formError) toast.error(state.formError);
  }, [state.formError]);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <FormField
          htmlFor="name"
          label="Nome da empresa"
          error={state.fieldErrors?.name}
          className="col-span-2"
        >
          <IconInput
            id="name"
            name="name"
            icon={IconBuilding}
            placeholder="Nome da empresa"
            required
          />
        </FormField>
        <FormField
          htmlFor="email"
          label="Email"
          error={state.fieldErrors?.email}
          className="col-span-2"
        >
          <IconInput
            id="email"
            name="email"
            type="email"
            icon={IconMail}
            placeholder="ex.: nome@empresa.com"
            autoComplete="email"
            required
          />
        </FormField>
        <FormField
          htmlFor="password"
          label="Password"
          error={state.fieldErrors?.password}
          className="col-span-2"
        >
          <IconInput
            id="password"
            name="password"
            isPassword
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
            required
          />
        </FormField>
        <FormField
          htmlFor="phone"
          label="Telefone"
          error={state.fieldErrors?.phone}
          className="col-span-2"
        >
          <PhoneInput id="phone" placeholder="Introduz o número" required />
        </FormField>
        <FormField
          htmlFor="nif"
          label="NIF"
          error={state.fieldErrors?.nif}
          className="col-span-2"
        >
          <IconInput
            id="nif"
            name="nif"
            icon={IconId}
            placeholder="Número de identificação fiscal"
            required
          />
        </FormField>
        <FormField
          htmlFor="address"
          label="Morada"
          error={state.fieldErrors?.address}
          className="col-span-2"
        >
          <IconInput
            id="address"
            name="address"
            icon={IconMapPin}
            placeholder="Morada da empresa"
            required
          />
        </FormField>
        <FormField
          htmlFor="responsible_name"
          label="Nome do responsável"
          error={state.fieldErrors?.responsible_name}
          className="col-span-2"
        >
          <IconInput
            id="responsible_name"
            name="responsible_name"
            icon={IconUser}
            placeholder="Nome completo do responsável"
            required
          />
        </FormField>
        <FormField
          htmlFor="responsible_id_document"
          label="Documento de identificação do responsável"
          error={state.fieldErrors?.responsible_id_document}
          className="col-span-2"
        >
          <IconInput
            id="responsible_id_document"
            name="responsible_id_document"
            icon={IconIdBadge}
            placeholder="Digite o seu número do BI ou passaporte"
            required
          />
        </FormField>
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "A criar…" : "Registar empresa"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Já tens conta?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline underline-offset-4"
        >
          Entrar
        </Link>
      </p>
    </form>
  );
}
