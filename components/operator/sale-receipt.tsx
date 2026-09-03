"use client";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import type { OperatorSaleResponse } from "@/lib/api/operator";

const METHOD_LABELS: Record<string, string> = {
  cash: "Dinheiro",
  pos: "POS",
  multicaixa_express: "Multicaixa Express",
};

interface SaleReceiptProps {
  sale: OperatorSaleResponse;
  price: number;
  method: string;
  phone?: string;
  doc?: string;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  );
}

/**
 * Talão de venda ao balcão: bilhete + recibo num só documento, formato ~80 mm.
 * `data-print-receipt` isola-o na impressão (ver app/globals.css).
 */
export function SaleReceipt({
  sale,
  price,
  method,
  phone,
  doc,
}: SaleReceiptProps) {
  const emittedAt = new Intl.DateTimeFormat("pt-AO", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date());

  return (
    <div className="flex flex-col items-start gap-3">
      <div
        data-print-receipt
        className="w-[320px] max-w-full rounded-xl border border-border bg-card p-5 text-sm text-card-foreground"
      >
        <div className="flex flex-col items-center gap-0.5 text-center">
          <p className="text-base font-bold tracking-tight">
            {sale.company_name}
          </p>
          <p className="text-xs text-muted-foreground">
            Bilhete de viagem · Venda ao balcão
          </p>
        </div>

        <div className="my-4 flex justify-center">
          {/* qr_image é um data URI SVG do backend. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={sale.qr_image}
            alt={`QR de ${sale.passenger_name}`}
            className="size-44"
          />
        </div>

        <div className="flex flex-col gap-1.5 border-t border-dashed border-border pt-3">
          <Row label="Passageiro" value={sale.passenger_name} />
          {phone ? <Row label="Telefone" value={phone} /> : null}
          {doc ? <Row label="Documento" value={doc} /> : null}
          <Row label="Rota" value={`${sale.origin} → ${sale.destination}`} />
          <Row
            label="Partida"
            value={`${sale.departure_date} · ${sale.departure_time}`}
          />
          <Row label="Lugar" value={String(sale.seat_number)} />
        </div>

        <div className="mt-3 flex flex-col gap-1.5 border-t border-dashed border-border pt-3">
          <Row label="Valor pago" value={formatCurrency(price)} />
          <Row label="Método" value={METHOD_LABELS[method] ?? method} />
          <Row
            label="Referência"
            value={sale.booking_id.slice(0, 8).toUpperCase()}
          />
          <Row label="Válido até" value={sale.valid_until} />
        </div>

        <p className="mt-4 border-t border-dashed border-border pt-3 text-center text-[11px] text-muted-foreground">
          Emitido em {emittedAt}
          <br />
          <span className="font-mono break-all">{sale.qr_hash}</span>
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => window.print()}
        className="print:hidden"
      >
        Imprimir talão
      </Button>
    </div>
  );
}
