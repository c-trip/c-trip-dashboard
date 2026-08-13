"use client";

import { useActionState } from "react";

import { createRouteAction } from "../actions";
import { FormError, FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { City } from "@/lib/api/routes";
import { initialActionState } from "@/lib/forms/action-state";

interface CreateRouteFormProps {
  cities: City[];
}

export function CreateRouteForm({ cities }: CreateRouteFormProps) {
  const [state, action, pending] = useActionState(createRouteAction, initialActionState);

  return (
    <form action={action} className="flex max-w-md flex-col gap-4">
      <FormError message={state.formError} />
      <FormField htmlFor="origin_city_id" label="Cidade de origem" error={state.fieldErrors?.origin_city_id}>
        <select
          id="origin_city_id"
          name="origin_city_id"
          required
          defaultValue=""
          className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
        >
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
        htmlFor="destination_city_id"
        label="Cidade de destino"
        error={state.fieldErrors?.destination_city_id}
      >
        <select
          id="destination_city_id"
          name="destination_city_id"
          required
          defaultValue=""
          className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
        >
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
      <FormField htmlFor="price" label="Preço base (Kz)" error={state.fieldErrors?.price}>
        <Input id="price" name="price" type="number" min={1} step={1} required />
      </FormField>
      <Button type="submit" disabled={pending}>
        {pending ? "A criar…" : "Criar rota"}
      </Button>
    </form>
  );
}
