"use client";

import { useActionState } from "react";

import { createRouteAction } from "../actions";
import { FormError, FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { City } from "@/lib/api/routes";
import { initialActionState } from "@/lib/forms/action-state";

interface CreateRouteFormProps {
  cities: City[];
}

export function CreateRouteForm({ cities }: CreateRouteFormProps) {
  const [state, action, pending] = useActionState(createRouteAction, initialActionState);

  return (
    <Card className="max-w-md">
      <CardContent>
        <form action={action} className="flex flex-col gap-5">
          <FormError message={state.formError} />
          <FormField htmlFor="origin_city_id" label="Cidade de origem" error={state.fieldErrors?.origin_city_id}>
            <select
              id="origin_city_id"
              name="origin_city_id"
              required
              defaultValue=""
              className="flex h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
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
              className="flex h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
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
          <Button type="submit" disabled={pending} className="mt-1">
            {pending ? "A criar\u2026" : "Criar rota"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
