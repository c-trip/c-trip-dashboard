"use client";

import { useActionState, useState, useTransition } from "react";

import {
  recordAction,
  validateAction,
  type ValidateActionState,
} from "./actions";
import { FormError, FormField } from "@/components/forms/form-field";
import { StatusBadge } from "@/components/feedback/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { initialActionState } from "@/lib/forms/action-state";

export function ValidatePanel({ scheduleId }: { scheduleId?: string }) {
  const [state, action, pending] = useActionState<
    ValidateActionState,
    FormData
  >(validateAction, initialActionState);
  const [recording, startRecording] = useTransition();
  const [boarded, setBoarded] = useState<string | null>(null);
  const [recordError, setRecordError] = useState<string | null>(null);

  const result = state.result;

  function handleRecord() {
    if (!state.qrHash) return;
    setRecordError(null);
    startRecording(async () => {
      const res = await recordAction(state.qrHash!, scheduleId);
      if (res.record) setBoarded(res.record.boarded_at);
      else
        setRecordError(
          res.formError ?? "Não foi possível registar o embarque.",
        );
    });
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-5">
        <form action={action} className="flex flex-col gap-4">
          <FormError message={state.formError} />
          {scheduleId ? (
            <input type="hidden" name="schedule_id" value={scheduleId} />
          ) : null}
          <FormField
            htmlFor="qr_hash"
            label="Código do QR"
            error={state.fieldErrors?.qr_hash}
          >
            <Input
              id="qr_hash"
              name="qr_hash"
              placeholder="32 caracteres hexadecimais"
              autoComplete="off"
              autoFocus
            />
          </FormField>
          <Button type="submit" disabled={pending} className="w-fit">
            {pending ? "A validar…" : "Validar"}
          </Button>
        </form>

        {result ? (
          <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
            <div className="flex items-center justify-between gap-3">
              <StatusBadge domain="boarding" status={result.status} />
              {result.first_boarded_at ? (
                <span className="text-xs text-muted-foreground">
                  1.º embarque: {result.first_boarded_at}
                </span>
              ) : null}
            </div>
            {result.status === "invalid" ? (
              <p className="text-sm text-destructive">
                {result.reason || "QR não reconhecido."}
              </p>
            ) : (
              <dl className="grid grid-cols-3 gap-x-3 gap-y-1 text-sm">
                <dt className="text-muted-foreground">Passageiro</dt>
                <dd className="col-span-2 font-medium">{result.passenger}</dd>
                <dt className="text-muted-foreground">Lugar</dt>
                <dd className="col-span-2 font-medium tabular-nums">
                  {result.seat_number}
                </dd>
                <dt className="text-muted-foreground">Destino</dt>
                <dd className="col-span-2 font-medium">{result.destination}</dd>
              </dl>
            )}

            {recordError ? (
              <p className="text-sm text-destructive">{recordError}</p>
            ) : null}

            {boarded ? (
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                Embarque registado às {boarded}.
              </p>
            ) : result.status === "allowed" ? (
              <Button
                type="button"
                onClick={handleRecord}
                disabled={recording}
                className="w-fit"
              >
                {recording ? "A registar…" : "Registar embarque"}
              </Button>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
