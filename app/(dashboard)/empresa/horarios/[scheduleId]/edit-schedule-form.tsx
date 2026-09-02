"use client";

import { useActionState } from "react";

import { updateScheduleAction } from "../actions";
import { FormError, FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Bus, Driver } from "@/lib/api/fleet";
import type { CompanySchedule } from "@/lib/api/schedules";
import { initialActionState } from "@/lib/forms/action-state";

const selectClass =
  "flex h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

interface EditScheduleFormProps {
  schedule: CompanySchedule;
  buses: Bus[];
  drivers: Driver[];
}

export function EditScheduleForm({ schedule, buses, drivers }: EditScheduleFormProps) {
  const action = updateScheduleAction.bind(null, schedule.schedule_id);
  const [state, formAction, pending] = useActionState(action, initialActionState);

  return (
    <Card>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-5">
          <FormError message={state.formError} />
          <FormField htmlFor="bus_id" label="Autocarro" error={state.fieldErrors?.bus_id}>
            <select id="bus_id" name="bus_id" defaultValue="" className={selectClass}>
              <option value="">Manter o actual</option>
              {buses
                .filter((bus) => bus.status === "active")
                .map((bus) => (
                  <option key={bus.id} value={bus.id}>
                    {bus.model} · {bus.plate}
                  </option>
                ))}
            </select>
          </FormField>
          <FormField htmlFor="driver_id" label="Motorista" error={state.fieldErrors?.driver_id}>
            <select id="driver_id" name="driver_id" defaultValue="" className={selectClass}>
              <option value="">Manter o actual</option>
              {drivers
                .filter((driver) => driver.available)
                .map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name}
                  </option>
                ))}
            </select>
          </FormField>
          <div className="flex flex-wrap gap-4">
            <FormField
              htmlFor="departure_date"
              label="Data"
              error={state.fieldErrors?.departure_date}
              className="min-w-36 flex-1"
            >
              <Input
                id="departure_date"
                name="departure_date"
                type="date"
                defaultValue={schedule.departure_date}
              />
            </FormField>
            <FormField
              htmlFor="departure_time"
              label="Hora"
              error={state.fieldErrors?.departure_time}
              className="min-w-28 flex-1"
            >
              <Input
                id="departure_time"
                name="departure_time"
                type="time"
                defaultValue={schedule.departure_time}
              />
            </FormField>
          </div>
          <div className="flex flex-wrap gap-4">
            <FormField
              htmlFor="total_seats"
              label="Lugares"
              error={state.fieldErrors?.total_seats}
              className="min-w-32 flex-1"
            >
              <Input
                id="total_seats"
                name="total_seats"
                type="number"
                min={1}
                defaultValue={schedule.total_seats}
              />
            </FormField>
            <FormField
              htmlFor="boarding_cutoff_minutes"
              label="Corte de embarque (min)"
              error={state.fieldErrors?.boarding_cutoff_minutes}
              hint="Deixa vazio para manter o actual"
              className="min-w-44 flex-1"
            >
              <Input id="boarding_cutoff_minutes" name="boarding_cutoff_minutes" type="number" min={0} />
            </FormField>
          </div>
          <Button type="submit" disabled={pending} className="mt-1">
            {pending ? "A guardar…" : "Guardar alterações"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
