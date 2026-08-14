"use client";

import { useRef, useState, useTransition, type ReactNode } from "react";

import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  trigger: ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
  onConfirm: () => Promise<void> | void;
}

/**
 * Confirmação explícita antes de qualquer acção pesada/irreversível — remover
 * colaborador, cancelar viagem, apagar role, suspender/rejeitar empresa — como
 * pede o guia de UI/UX. Usa <dialog> nativo, sem dependências extra.
 */
export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "destructive",
  onConfirm,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <span onClick={() => dialogRef.current?.showModal()}>{trigger}</span>
      <dialog
        ref={dialogRef}
        className="m-auto w-full max-w-md rounded-xl border border-border bg-card p-0 text-card-foreground shadow-lg backdrop:bg-black/40"
        onClose={() => setError(null)}
      >
        <div className="flex flex-col gap-5 p-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => dialogRef.current?.close()}>
              {cancelLabel}
            </Button>
            <Button
              type="button"
              variant={variant}
              disabled={pending}
              onClick={() => {
                setError(null);
                startTransition(async () => {
                  try {
                    await onConfirm();
                    dialogRef.current?.close();
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Não foi possível concluir a acção.");
                  }
                });
              }}
            >
              {pending ? "A processar…" : confirmLabel}
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
}
