"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { IconCamera, IconX } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

// `BarcodeDetector` ainda não está nos tipos padrão do DOM.
interface BarcodeDetectorLike {
  detect(source: CanvasImageSource): Promise<Array<{ rawValue: string }>>;
}
interface BarcodeDetectorCtor {
  new (options?: { formats: string[] }): BarcodeDetectorLike;
}
declare global {
  interface Window {
    BarcodeDetector?: BarcodeDetectorCtor;
  }
}

const HASH_RE = /[0-9a-f]{32}/i;

/** Extrai o hash (32 hex) de um QR — aceita o hash cru ou um URL que o contenha. */
function extractHash(raw: string): string | null {
  const match = raw.match(HASH_RE);
  return match ? match[0] : null;
}

/**
 * Leitor de QR pela câmara traseira, via `BarcodeDetector` (nativo em Chrome /
 * Android). Onde não existe, o operador usa o campo de texto ao lado.
 */
export function QrScanner({ onScan }: { onScan: (hash: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supported =
    typeof window !== "undefined" && "BarcodeDetector" in window;

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setOpen(false);
  }, []);

  useEffect(() => stop, [stop]);

  async function start() {
    setError(null);
    if (!window.BarcodeDetector) {
      setError("Este browser não lê QR pela câmara. Introduz o código à mão.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      setOpen(true);
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      await video.play();

      const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
      const tick = async () => {
        if (!streamRef.current) return;
        try {
          const codes = await detector.detect(video);
          for (const code of codes) {
            const hash = extractHash(code.rawValue);
            if (hash) {
              onScan(hash);
              stop();
              return;
            }
          }
        } catch {
          // frame ainda não pronto — continua a tentar
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      setError("Não foi possível aceder à câmara. Verifica as permissões.");
      stop();
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {open ? (
        <div className="relative overflow-hidden rounded-lg border border-border bg-black">
          <video
            ref={videoRef}
            className="aspect-square w-full max-w-xs object-cover"
            muted
            playsInline
          />
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            onClick={stop}
            title="Fechar câmara"
            className="absolute right-2 top-2"
          >
            <IconX size={16} />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={start}
          disabled={!supported}
          className="w-fit"
        >
          <IconCamera size={16} data-icon="inline-start" />
          Ler QR com a câmara
        </Button>
      )}
      {!supported ? (
        <p className="text-xs text-muted-foreground">
          Câmara indisponível neste browser — usa o campo abaixo.
        </p>
      ) : null}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
