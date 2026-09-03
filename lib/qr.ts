/**
 * O backend documenta `qr_image` como "QR code em base64 (SVG)" — nuns casos vem
 * já como data URI, noutros como base64 cru (ou até o SVG em texto). Sem o
 * prefixo certo o `<img>` não mostra nada, por isso normalizamos aqui.
 *
 * Vive fora de `lib/api/*` de propósito: é usado por componentes cliente, e
 * `lib/api/client.ts` é `server-only`.
 */
export function qrImageSrc(qrImage: string): string {
  const raw = qrImage?.trim() ?? "";
  if (!raw) return "";
  if (raw.startsWith("data:")) return raw;
  if (raw.startsWith("<svg")) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(raw)}`;
  }
  return `data:image/svg+xml;base64,${raw}`;
}
