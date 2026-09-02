"use client";

import { useActionState, useState } from "react";

import { createBusAction } from "../actions";
import { FormError, FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { initialActionState } from "@/lib/forms/action-state";

export function CreateBusForm() {
  const [state, action, pending] = useActionState(createBusAction, initialActionState);
  const [rows, setRows] = useState("");
  const [perRow, setPerRow] = useState("");

  const totalSeats = Number(rows) > 0 && Number(perRow) > 0 ? Number(rows) * Number(perRow) : null;

  return (
    <Card className="max-w-md">
      <CardContent>
        <form action={action} className="flex flex-col gap-5">
          <FormError message={state.formError} />
          <FormField htmlFor="model" label="Modelo" error={state.fieldErrors?.model}>
            <Input id="model" name="model" placeholder="ex.: Toyota Coaster" required />
          </FormField>
          <FormField htmlFor="license_plate" label="Matrícula" error={state.fieldErrors?.license_plate}>
            <Input id="license_plate" name="license_plate" placeholder="ex.: LD-00-00-AA" required />
          </FormField>
          <div className="flex gap-4">
            <FormField
              htmlFor="total_rows"
              label="Nº de filas"
              error={state.fieldErrors?.total_rows}
              className="flex-1"
            >
              <Input
                id="total_rows"
                name="total_rows"
                type="number"
                min={1}
                step={1}
                required
                value={rows}
                onChange={(e) => setRows(e.target.value)}
              />
            </FormField>
            <FormField
              htmlFor="seats_per_row"
              label="Lugares por fila"
              error={state.fieldErrors?.seats_per_row}
              className="flex-1"
            >
              <Input
                id="seats_per_row"
                name="seats_per_row"
                type="number"
                min={1}
                step={1}
                required
                value={perRow}
                onChange={(e) => setPerRow(e.target.value)}
              />
            </FormField>
          </div>
          <p className="text-sm text-muted-foreground">
            Total de lugares:{" "}
            <span className="font-semibold tabular-nums text-foreground">
              {totalSeats ?? "—"}
            </span>
          </p>
          <Button type="submit" disabled={pending} className="mt-1">
            {pending ? "A guardar…" : "Adicionar autocarro"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
