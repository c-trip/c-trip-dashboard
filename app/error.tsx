"use client";

import { useEffect } from "react";
import { IconAlertTriangle, IconRefresh } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";


export default function ErrorBoundary({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <IconAlertTriangle size={24} className="text-destructive" />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-bold text-foreground">Algo correu mal</h2>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Não foi possível ligar ao servidor da C-Trip. Verifica a tua ligação e tenta novamente.
            </p>
          </div>
          <Button type="button" size="sm" onClick={() => retry()}>
            <IconRefresh size={16} data-icon="inline-start" />
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
