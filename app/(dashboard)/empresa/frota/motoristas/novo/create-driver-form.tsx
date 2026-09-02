"use client";

import { useActionState, useState } from "react";

import { createDriverAction } from "../actions";
import { EmptyState } from "@/components/feedback/empty-state";
import { FormError, FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { CompanyUser } from "@/lib/api/companies";
import { initialActionState } from "@/lib/forms/action-state";

const SELECT_CLASS =
  "flex h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

interface CreateDriverFormProps {
  users: CompanyUser[];
}

export function CreateDriverForm({ users }: CreateDriverFormProps) {
  const [state, action, pending] = useActionState(createDriverAction, initialActionState);
  const [name, setName] = useState("");

  if (users.length === 0) {
    return (
      <EmptyState
        title="Sem colaboradores para associar"
        description="Cria primeiro uma conta em Colaboradores; depois volta aqui para a marcar como motorista."
      />
    );
  }

  return (
    <Card className="max-w-md">
      <CardContent>
        <form action={action} className="flex flex-col gap-5">
          <FormError message={state.formError} />
          <FormField htmlFor="user_id" label="Colaborador" error={state.fieldErrors?.user_id}>
            <select
              id="user_id"
              name="user_id"
              required
              defaultValue=""
              className={SELECT_CLASS}
              onChange={(e) => {
                const picked = users.find((user) => user.id === e.target.value);
                if (picked && !name) setName(picked.name);
              }}
            >
              <option value="" disabled>
                Escolhe um colaborador
              </option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} · {user.email}
                </option>
              ))}
            </select>
          </FormField>
          <FormField htmlFor="name" label="Nome a apresentar" error={state.fieldErrors?.name}>
            <Input
              id="name"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormField>
          <FormField htmlFor="phone" label="Telefone (opcional)" error={state.fieldErrors?.phone}>
            <Input id="phone" name="phone" type="tel" placeholder="ex.: +244 923 000 000" />
          </FormField>
          <Button type="submit" disabled={pending} className="mt-1">
            {pending ? "A guardar…" : "Adicionar motorista"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
