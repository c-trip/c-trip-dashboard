"use client";

import { useActionState } from "react";

import { createRoleAction } from "../actions";
import { FormError, FormField } from "@/components/forms/form-field";
import { PermissionChecklist } from "@/components/forms/permission-checklist";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { PlatformPermission } from "@/lib/api/admin";
import { initialActionState } from "@/lib/forms/action-state";

interface CreateRoleFormProps {
  permissions: PlatformPermission[];
}

export function CreateRoleForm({ permissions }: CreateRoleFormProps) {
  const [state, action, pending] = useActionState(createRoleAction, initialActionState);

  return (
    <Card>
      <CardContent>
        <form action={action} className="flex flex-col gap-5">
          <FormError message={state.formError} />
          <FormField htmlFor="nome" label="Nome" error={state.fieldErrors?.nome}>
            <Input id="nome" name="nome" required placeholder="Ex.: motorista, cobrador" />
          </FormField>
          <FormField htmlFor="descricao" label="Descrição" error={state.fieldErrors?.descricao}>
            <Input id="descricao" name="descricao" required placeholder="O que esta role permite fazer" />
          </FormField>
          <PermissionChecklist name="permission_codes" options={permissions} defaultSelected={[]} />
          <Button type="submit" disabled={pending} className="mt-1">
            {pending ? "A criar\u2026" : "Criar role"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
