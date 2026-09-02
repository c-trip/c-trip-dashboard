"use client";

import { useActionState, useEffect, useRef } from "react";

import { createTaskAction } from "./actions";
import { FormError, FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { CompanyUser } from "@/lib/api/companies";
import { initialActionState } from "@/lib/forms/action-state";

const selectClass =
  "flex h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

interface CreateTaskFormProps {
  users: CompanyUser[];
}

export function CreateTaskForm({ users }: CreateTaskFormProps) {
  const [state, action, pending] = useActionState(createTaskAction, initialActionState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <Card>
      <CardContent>
        <form ref={formRef} action={action} className="flex flex-col gap-4">
          <FormError message={state.formError} />
          <div className="flex flex-wrap gap-4">
            <FormField
              htmlFor="assigned_to"
              label="Atribuir a"
              error={state.fieldErrors?.assigned_to}
              className="min-w-48 flex-1"
            >
              <select id="assigned_to" name="assigned_to" required defaultValue="" className={selectClass}>
                <option value="" disabled>
                  Escolhe um colaborador
                </option>
                {users
                  .filter((user) => user.is_active)
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} · {user.email}
                    </option>
                  ))}
              </select>
            </FormField>
            <FormField
              htmlFor="title"
              label="Título"
              error={state.fieldErrors?.title}
              className="min-w-48 flex-1"
            >
              <Input id="title" name="title" required />
            </FormField>
          </div>
          <FormField htmlFor="description" label="Descrição" error={state.fieldErrors?.description}>
            <textarea
              id="description"
              name="description"
              required
              rows={3}
              className="flex w-full min-w-0 rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </FormField>
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? "A criar…" : "Criar tarefa"}
            </Button>
            {state.success ? (
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Tarefa criada.</p>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
