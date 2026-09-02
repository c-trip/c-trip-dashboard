"use client";

import { useActionState } from "react";

import { sellAction, type SellActionState } from "./actions";
import { FormError, FormField } from "@/components/forms/form-field";
import { QrTicket } from "@/components/operator/qr-ticket";
import { SeatMap } from "@/components/schedules/seat-map";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ScheduleSeats } from "@/lib/api/schedules";
import { initialActionState } from "@/lib/forms/action-state";

const selectClass =
  "flex h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

interface SellFormProps {
  scheduleId: string;
  seats: ScheduleSeats;
  route: string;
  departure: string;
}

export function SellForm({
  scheduleId,
  seats,
  route,
  departure,
}: SellFormProps) {
  const boundAction = sellAction.bind(null, scheduleId);
  const [state, action, pending] = useActionState<SellActionState, FormData>(
    boundAction,
    initialActionState,
  );

  if (state.sale) {
    return (
      <div className="flex flex-col gap-4">
        <p className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm font-medium text-emerald-700 dark:text-emerald-400">
          Bilhete emitido. Entrega o QR ao passageiro.
        </p>
        <QrTicket
          qrImage={state.sale.qr_image}
          qrHash={state.sale.qr_hash}
          passengerName={state.sale.passenger_name}
          seatNumber={state.sale.seat_number}
          route={`${state.sale.origin} → ${state.sale.destination}`}
          departure={`${state.sale.departure_date} · ${state.sale.departure_time}`}
          validUntil={state.sale.valid_until}
        />
      </div>
    );
  }

  return (
    <Card>
      <CardContent>
        <form action={action} className="flex flex-col gap-5">
          <FormError message={state.formError} />

          <FormField
            htmlFor="seat"
            label="Lugar"
            error={state.fieldErrors?.seat_number}
          >
            <SeatMap
              totalSeats={seats.total_seats}
              available={seats.available}
              occupied={seats.occupied}
              selectable
              name="seat_number"
            />
          </FormField>

          <FormField
            htmlFor="passenger_name"
            label="Nome do passageiro"
            error={state.fieldErrors?.passenger_name}
          >
            <Input
              id="passenger_name"
              name="passenger_name"
              required
              placeholder="Nome completo"
            />
          </FormField>

          <div className="flex flex-wrap gap-4">
            <FormField
              htmlFor="passenger_phone"
              label="Telefone (opcional)"
              error={state.fieldErrors?.passenger_phone}
              className="min-w-40 flex-1"
            >
              <Input
                id="passenger_phone"
                name="passenger_phone"
                placeholder="9XX XXX XXX"
              />
            </FormField>
            <FormField
              htmlFor="passenger_id_doc"
              label="Documento (opcional)"
              error={state.fieldErrors?.passenger_id_doc}
              className="min-w-40 flex-1"
            >
              <Input
                id="passenger_id_doc"
                name="passenger_id_doc"
                placeholder="BI / passaporte"
              />
            </FormField>
          </div>

          <div className="flex flex-wrap gap-4">
            <FormField
              htmlFor="total_price"
              label="Valor (Kz)"
              error={state.fieldErrors?.total_price}
              className="min-w-32 flex-1"
            >
              <Input
                id="total_price"
                name="total_price"
                type="number"
                min={1}
                step="0.01"
                required
              />
            </FormField>
            <FormField
              htmlFor="payment_method"
              label="Método"
              error={state.fieldErrors?.payment_method}
              className="min-w-40 flex-1"
            >
              <select
                id="payment_method"
                name="payment_method"
                defaultValue="cash"
                className={selectClass}
              >
                <option value="cash">Dinheiro</option>
                <option value="pos">POS</option>
                <option value="multicaixa_express">Multicaixa Express</option>
              </select>
            </FormField>
          </div>

          <p className="text-xs text-muted-foreground">
            {route} · {departure}
          </p>

          <Button type="submit" disabled={pending} className="mt-1">
            {pending ? "A emitir…" : "Emitir bilhete"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
