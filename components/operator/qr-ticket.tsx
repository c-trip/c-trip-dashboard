"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { qrImageSrc } from "@/lib/qr";

interface QrTicketProps {
  qrImage: string;
  qrHash: string;
  passengerName: string;
  seatNumber: number;
  route?: string;
  departure?: string;
  validUntil?: string;
}

/** Bilhete com QR — resultado de uma venda ao balcão ou de uma reimpressão. */
export function QrTicket({
  qrImage,
  qrHash,
  passengerName,
  seatNumber,
  route,
  departure,
  validUntil,
}: QrTicketProps) {
  return (
    <Card
      data-print-ticket
      className="max-w-sm print:border-0 print:shadow-none"
    >
      <CardContent className="flex flex-col items-center gap-4 text-center">
        {qrImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={qrImageSrc(qrImage)}
            alt={`QR do bilhete de ${passengerName}`}
            className="size-48 print:size-40"
          />
        ) : (
          <p className="py-8 text-xs text-destructive">
            A API não devolveu o QR. Usa o código em baixo.
          </p>
        )}
        <div className="flex flex-col gap-1">
          <p className="text-base font-bold text-foreground">{passengerName}</p>
          <p className="text-sm text-muted-foreground">
            Lugar{" "}
            <span className="font-semibold tabular-nums text-foreground">
              {seatNumber}
            </span>
            {route ? ` · ${route}` : null}
          </p>
          {departure ? (
            <p className="text-xs text-muted-foreground">
              Partida: {departure}
            </p>
          ) : null}
          {validUntil ? (
            <p className="text-xs text-muted-foreground">
              Válido até: {validUntil}
            </p>
          ) : null}
          <p className="mt-1 font-mono text-[11px] break-all text-muted-foreground">
            {qrHash}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => window.print()}
          className="print:hidden"
        >
          Imprimir
        </Button>
      </CardContent>
    </Card>
  );
}
