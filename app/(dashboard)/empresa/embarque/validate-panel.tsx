"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import { IconArrowRight } from "@tabler/icons-react";

import {
  recordAction,
  validateAction,
  type ValidateActionState,
} from "./actions";
import { FormError } from "@/components/forms/form-field";
import { StatusBadge } from "@/components/feedback/status-badge";
import { QrScanner } from "@/components/operator/qr-scanner";
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
  const formRef = useRef<HTMLFormElement>(null);
  const hashRef = useRef<HTMLInputElement>(null);

  const result = state.result;

  function handleScan(hash: string) {
    if (hashRef.current) hashRef.current.value = hash;
    formRef.current?.requestSubmit();
  }

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
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-4">
          <QrScanner onScan={handleScan} />

          <form
            ref={formRef}
            action={action}
            className="flex items-start gap-2"
          >
            {scheduleId ? (
              <input type="hidden" name="schedule_id" value={scheduleId} />
            ) : null}
            <div className="flex-1">
              <Input
                ref={hashRef}
                name="qr_hash"
                placeholder="Código do QR (32 caracteres)"
                autoComplete="off"
                aria-invalid={Boolean(state.fieldErrors?.qr_hash)}
              />
              {state.fieldErrors?.qr_hash ? (
                <p className="mt-1 text-xs font-medium text-destructive">
                  {state.fieldErrors.qr_hash[0]}
                </p>
              ) : null}
            </div>
            <Button
              type="submit"
              size="icon"
              disabled={pending}
              title="Validar"
            >
              <IconArrowRight size={18} />
            </Button>
          </form>

          <FormError message={state.formError} />
        </CardContent>
      </Card>

      {result ? (
        <Card
          className={
            result.status === "allowed"
              ? "border-emerald-500/30"
              : result.status === "already_boarded"
                ? "border-amber-500/30"
                : "border-destructive/30"
          }
        >
          <CardContent className="flex flex-col items-center gap-4 text-center">
            <StatusBadge domain="boarding" status={result.status} />

            {result.status === "invalid" ? (
              <p className="text-sm text-destructive">
                {result.reason || "QR não reconhecido."}
              </p>
            ) : (
              <div className="flex flex-col gap-1">
                <p className="text-lg font-bold text-foreground">
                  {result.passenger}
                </p>
                <p className="text-sm text-muted-foreground">
                  Lugar{" "}
                  <span className="font-semibold tabular-nums text-foreground">
                    {result.seat_number}
                  </span>{" "}
                  · {result.destination}
                </p>
                {result.first_boarded_at ? (
                  <p className="text-xs text-muted-foreground">
                    1.º embarque: {result.first_boarded_at}
                  </p>
                ) : null}
              </div>
            )}

            {recordError ? (
              <p className="text-sm text-destructive">{recordError}</p>
            ) : null}

            {boarded ? (
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                Embarque registado às {boarded}.
              </p>
            ) : result.status === "allowed" ? (
              <Button
                type="button"
                onClick={handleRecord}
                disabled={recording}
                className="w-full"
              >
                {recording ? "A registar…" : "Registar embarque"}
              </Button>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
