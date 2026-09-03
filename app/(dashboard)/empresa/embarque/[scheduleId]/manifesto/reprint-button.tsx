"use client";

import { useState, useTransition } from "react";

import { reprintQrAction } from "./actions";
import { QrTicket } from "@/components/operator/qr-ticket";
import { Button } from "@/components/ui/button";
import type { ReprintQrResponse } from "@/lib/api/operator";

export function ReprintButton({
  scheduleId,
  seat,
}: {
  scheduleId: string;
  seat: number;
}) {
  const [pending, start] = useTransition();
  const [ticket, setTicket] = useState<ReprintQrResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (ticket) {
    return (
      <div className="flex flex-col items-end gap-2">
        <QrTicket
          qrImage={ticket.qr_image}
          qrHash={ticket.qr_hash}
          passengerName={ticket.passenger_name}
          seatNumber={ticket.seat_number}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setTicket(null)}
        >
          Fechar
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={() =>
          start(async () => {
            setError(null);
            try {
              setTicket(await reprintQrAction(scheduleId, seat));
            } catch (err) {
              setError(err instanceof Error ? err.message : "Falhou.");
            }
          })
        }
      >
        {pending ? "…" : "Reimprimir QR"}
      </Button>
      {error ? <span className="text-xs text-destructive">{error}</span> : null}
    </div>
  );
}
