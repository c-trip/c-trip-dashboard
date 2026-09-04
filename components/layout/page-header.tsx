import type { ReactNode } from "react";

/**
 * Cabeçalho de página do dashboard: rótulo de contexto ("Operação · Balcão"),
 * título, descrição opcional e acções à direita. Um só padrão para todos os
 * ecrãs, para o dashboard ler como um produto e não como páginas soltas.
 */
export function PageHeader({
  context,
  title,
  description,
  actions,
}: {
  context?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
      <div className="min-w-0">
        {context ? (
          <p className="text-xs font-medium text-muted-foreground">{context}</p>
        ) : null}
        <h2 className="mt-0.5 text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
