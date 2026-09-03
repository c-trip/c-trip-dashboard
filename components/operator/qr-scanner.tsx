"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { IconCamera, IconX } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

// `BarcodeDetector` é o caminho rápido (Android/ChromeOS). No desktop não existe,
// por isso o `jsQR` faz a descodificação em JS a partir dos frames do vídeo.
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

const MAX_EDGE = 480;

export function QrScanner({ onScan }: { onScan: (hash: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Este browser não dá acesso à câmara. Introduz o código à mão.");
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

      const detector = window.BarcodeDetector
        ? new window.BarcodeDetector({ formats: ["qr_code"] })
        : null;

      const canvas = (canvasRef.current ??= document.createElement("canvas"));
      const ctx = canvas.getContext("2d", { willReadFrequently: true });

      const found = (raw: string) => {
        const hash = extractHash(raw);
        if (!hash) return false;
        onScan(hash);
        stop();
        return true;
      };

      const tick = async () => {
        if (!streamRef.current) return;
        try {
          if (detector) {
            const codes = await detector.detect(video);
            for (const code of codes) if (found(code.rawValue)) return;
          } else if (ctx && video.videoWidth > 0) {
            const scale = Math.min(
              1,
              MAX_EDGE / Math.max(video.videoWidth, video.videoHeight),
            );
            canvas.width = Math.round(video.videoWidth * scale);
            canvas.height = Math.round(video.videoHeight * scale);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const result = jsQR(frame.data, frame.width, frame.height, {
              inversionAttempts: "dontInvert",
            });
            if (result && found(result.data)) return;
          }
        } catch {
          // frame ainda não pronto — continua a tentar
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      setError(
        "Não foi possível aceder à câmara. Verifica as permissões do browser.",
      );
      stop();
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {open ? (
        <div className="relative w-fit overflow-hidden rounded-lg border border-border bg-black">
          <video
            ref={videoRef}
            className="aspect-square w-64 object-cover"
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
          className="w-fit"
        >
          <IconCamera size={16} data-icon="inline-start" />
          Ler QR com a câmara
        </Button>
      )}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
