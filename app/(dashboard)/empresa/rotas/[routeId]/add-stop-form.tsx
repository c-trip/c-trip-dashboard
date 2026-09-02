"use client";

import { useActionState, useEffect, useRef } from "react";

import { addRouteStopAction } from "../actions";
import { FormError, FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { City } from "@/lib/api/routes";
import { initialActionState } from "@/lib/forms/action-state";

const SELECT_CLASS =
  "flex h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

interface AddRouteStopFormProps {
  routeId: string;
  cities: City[];
}

export function AddRouteStopForm({ routeId, cities }: AddRouteStopFormProps) {
  const action = addRouteStopAction.bind(null, routeId);
  const [state, formAction, pending] = useActionState(action, initialActionState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <Card>
      <CardContent>
        <form ref={formRef} action={formAction} className="flex flex-wrap items-end gap-4">
          <FormError message={state.formError} />
          <FormField
            htmlFor="city_id"
            label="Cidade da paragem"
            error={state.fieldErrors?.city_id}
            className="min-w-48 flex-1"
          >
            <select id="city_id" name="city_id" required defaultValue="" className={SELECT_CLASS}>
              <option value="" disabled>
                Escolhe uma cidade
              </option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name} · {city.province}
                </option>
              ))}
            </select>
          </FormField>
          <FormField
            htmlFor="price"
            label="Preço acumulado (Kz)"
            error={state.fieldErrors?.price}
            hint="Valor total desde a origem até esta paragem, não o troço."
            className="min-w-40 flex-1"
          >
            <Input id="price" name="price" type="number" min={1} step={1} required />
          </FormField>
          <Button type="submit" disabled={pending}>
            {pending ? "A guardar…" : "Adicionar paragem"}
          </Button>
          {state.success ? (
            <p className="w-full text-sm font-medium text-emerald-600 dark:text-emerald-400">
              Paragem adicionada.
            </p>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
