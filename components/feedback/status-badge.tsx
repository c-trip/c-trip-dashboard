import { cn } from "@/lib/utils";

type Tone = "neutral" | "positive" | "warning" | "negative" | "info";

interface StatusMeta {
  label: string;
  tone: Tone;
}

const TABLES = {
  company: {
    pending: { label: "Pendente", tone: "warning" },
    verified: { label: "Aprovada", tone: "positive" },
    rejected: { label: "Rejeitada", tone: "negative" },
    suspended: { label: "Suspensa", tone: "negative" },
  },
  schedule: {
    scheduled: { label: "Agendada", tone: "positive" },
    cancelled: { label: "Cancelada", tone: "negative" },
  },
  booking: {
    confirmed: { label: "Confirmada", tone: "positive" },
    cancelled: { label: "Cancelada", tone: "negative" },
  },
  payment: {
    pending: { label: "Pendente", tone: "warning" },
    confirmed: { label: "Confirmado", tone: "positive" },
    failed: { label: "Falhou", tone: "negative" },
    cancelled: { label: "Cancelado", tone: "neutral" },
    no_payment: { label: "Sem pagamento", tone: "neutral" },
  },
  task: {
    pending: { label: "Por fazer", tone: "neutral" },
    in_progress: { label: "Em curso", tone: "info" },
    done: { label: "Concluída", tone: "positive" },
  },
  bus: {
    active: { label: "Activo", tone: "positive" },
    maintenance: { label: "Manutenção", tone: "warning" },
    inactive: { label: "Inactivo", tone: "neutral" },
  },
  boarding: {
    allowed: { label: "Permitido", tone: "positive" },
    already_boarded: { label: "Já embarcou", tone: "warning" },
    invalid: { label: "Inválido", tone: "negative" },
  },
} satisfies Record<string, Record<string, StatusMeta>>;

const TONE_CLASSES: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground",
  positive: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  negative: "bg-destructive/10 text-destructive",
  info: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
};

export type StatusDomain = keyof typeof TABLES;

interface StatusBadgeProps {
  domain: StatusDomain;
  status: string;
  className?: string;
}

export function StatusBadge({ domain, status, className }: StatusBadgeProps) {
  const table = TABLES[domain] as Record<string, StatusMeta>;
  const meta = table[status] ?? { label: status, tone: "neutral" as Tone };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ring-1 ring-inset",
        TONE_CLASSES[meta.tone],
        meta.tone === "positive" && "ring-emerald-500/20",
        meta.tone === "warning" && "ring-amber-500/20",
        meta.tone === "negative" && "ring-destructive/20",
        meta.tone === "info" && "ring-sky-500/20",
        meta.tone === "neutral" && "ring-border",
        className,
      )}
    >
      {meta.label}
    </span>
  );
}
