import Link from "next/link";
import { IconAlertTriangle, IconLock } from "@tabler/icons-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ApiError, apiErrorMessage, type ApiErrorInfo } from "@/lib/api/errors";
import { cn } from "@/lib/utils";

/** Deduz a categoria/mensagem de um erro apanhado (ApiError ou outro). */
export function toErrorInfo(error: unknown): ApiErrorInfo {
  if (error instanceof ApiError) return error.info;
  return apiErrorMessage(0);
}

const PRESENTATION: Record<
  ApiErrorInfo["kind"],
  { title: string; icon: typeof IconAlertTriangle; tone: "amber" | "neutral" }
> = {
  auth: { title: "Sessão expirada", icon: IconLock, tone: "neutral" },
  company_pending: {
    title: "Empresa pendente de aprovação",
    icon: IconAlertTriangle,
    tone: "amber",
  },
  company_suspended: {
    title: "Empresa suspensa",
    icon: IconAlertTriangle,
    tone: "amber",
  },
  forbidden: { title: "Sem permissão", icon: IconLock, tone: "neutral" },
  business: {
    title: "Não foi possível concluir",
    icon: IconAlertTriangle,
    tone: "neutral",
  },
  server: {
    title: "Algo correu mal",
    icon: IconAlertTriangle,
    tone: "neutral",
  },
};

/**
 * Estado de erro para páginas que falham a carregar dados. Ao contrário do
 * antigo `<CompanyBlocked>`, só fala em "empresa por aprovar" quando o erro é
 * mesmo isso — um 403 de falta de permissão mostra a mensagem correcta.
 */
export function ApiErrorState({
  error,
  className,
}: {
  error: unknown;
  className?: string;
}) {
  const info = toErrorInfo(error);
  const { title, icon: Icon, tone } = PRESENTATION[info.kind];

  return (
    <Card
      className={cn(
        tone === "amber"
          ? "border-amber-500/20 bg-amber-500/5"
          : "border-border",
        className,
      )}
    >
      <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
        <div
          className={cn(
            "flex size-12 items-center justify-center rounded-full",
            tone === "amber" ? "bg-amber-500/10" : "bg-muted",
          )}
        >
          <Icon
            size={24}
            className={
              tone === "amber"
                ? "text-amber-600 dark:text-amber-400"
                : "text-muted-foreground"
            }
          />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-bold text-foreground">{title}</h3>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            {info.msg}
          </p>
        </div>
        <Link
          href="/empresa"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Voltar ao início
        </Link>
      </CardContent>
    </Card>
  );
}
