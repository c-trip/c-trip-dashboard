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
        className="m-auto w-full max-w-md rounded-xl border border-border bg-card p-0 text-card-foreground shadow-xl backdrop:bg-black/50 backdrop:backdrop-blur-sm"
        onClose={() => setError(null)}
      >
        <div className="flex flex-col gap-6 p-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-bold tracking-tight">{title}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
          </div>
          {error ? (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm font-medium text-destructive">
              {error}
            </div>
          ) : null}
          <div className="flex justify-end gap-3">
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
              {pending ? "A processar\u2026" : confirmLabel}
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
}
