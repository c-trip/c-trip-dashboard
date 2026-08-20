"use client";

import { useActionState } from "react";

import { createScheduleAction } from "../actions";
import { FormError, FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { CompanyRoute } from "@/lib/api/routes";
import type { Bus, Driver } from "@/lib/api/fleet";
import { initialActionState } from "@/lib/forms/action-state";

interface CreateScheduleFormProps {
  routes: CompanyRoute[];
  buses: Bus[];
  drivers: Driver[];
}

const selectClass =
  "flex h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function CreateScheduleForm({ routes, buses, drivers }: CreateScheduleFormProps) {
  const [state, action, pending] = useActionState(createScheduleAction, initialActionState);

  return (
    <Card>
      <CardContent>
        <form action={action} className="flex flex-col gap-5">
          <FormError message={state.formError} />
          <FormField htmlFor="route_id" label="Rota" error={state.fieldErrors?.route_id}>
            <select id="route_id" name="route_id" required defaultValue="" className={selectClass}>
              <option value="" disabled>Escolhe uma rota</option>
              {routes.filter((r) => r.is_active).map((r) => (
                <option key={r.id} value={r.id}>
                  {r.origin_city} → {r.destination_city}
                </option>
              ))}
            </select>
          </FormField>
          <FormField htmlFor="bus_id" label="Autocarro" error={state.fieldErrors?.bus_id}>
            <select id="bus_id" name="bus_id" required defaultValue="" className={selectClass}>
              <option value="" disabled>Escolhe um autocarro</option>
              {buses.filter((b) => b.status === "active").map((b) => (
                <option key={b.id} value={b.id}>
                  {b.model} · {b.plate}
                </option>
              ))}
            </select>
          </FormField>
          <FormField htmlFor="driver_id" label="Motorista" error={state.fieldErrors?.driver_id}>
            <select id="driver_id" name="driver_id" required defaultValue="" className={selectClass}>
              <option value="" disabled>Escolhe um motorista</option>
              {drivers.filter((d) => d.available).map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </FormField>
          <div className="flex flex-wrap gap-4">
            <FormField htmlFor="departure_date" label="Data" error={state.fieldErrors?.departure_date} className="min-w-36 flex-1">
              <Input id="departure_date" name="departure_date" type="date" required />
            </FormField>
            <FormField htmlFor="departure_time" label="Hora" error={state.fieldErrors?.departure_time} className="min-w-28 flex-1">
              <Input id="departure_time" name="departure_time" type="time" required />
            </FormField>
          </div>
          <div className="flex flex-wrap gap-4">
            <FormField htmlFor="total_seats" label="Lugares" error={state.fieldErrors?.total_seats} className="min-w-32 flex-1">
              <Input id="total_seats" name="total_seats" type="number" min={1} required />
            </FormField>
            <FormField
              htmlFor="boarding_cutoff_minutes"
              label="Corte de embarque (min)"
              error={state.fieldErrors?.boarding_cutoff_minutes}
              hint="Opcional — padrão: 30 min"
              className="min-w-44 flex-1"
            >
              <Input id="boarding_cutoff_minutes" name="boarding_cutoff_minutes" type="number" min={0} />
            </FormField>
          </div>
          <Button type="submit" disabled={pending} className="mt-1">
            {pending ? "A agendar\u2026" : "Agendar viagem"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
