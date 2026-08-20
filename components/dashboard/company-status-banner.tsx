import { IconAlertTriangle } from "@tabler/icons-react";

import type { CompanyStatus } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const MESSAGES: Partial<Record<CompanyStatus, { text: string; tone: "warning" | "negative" }>> = {
  pending: {
    text: "A tua empresa está a aguardar aprovação da C-Trip. Algumas acções podem continuar disponíveis, mas os bilhetes só ficam visíveis ao público depois da aprovação.",
    tone: "warning",
  },
  suspended: {
    text: "A tua empresa está suspensa pela C-Trip. Contacta o suporte para regularizar a situação.",
    tone: "negative",
  },
  rejected: {
    text: "O registo desta empresa foi rejeitado pela C-Trip. Contacta o suporte para mais informação.",
    tone: "negative",
  },
};

interface CompanyStatusBannerProps {
  status: CompanyStatus;
}

export function CompanyStatusBanner({ status }: CompanyStatusBannerProps) {
  const entry = MESSAGES[status];
  if (!entry) return null;

  const isWarning = entry.tone === "warning";

  return (
    <div
      className={cn(
        "flex items-start gap-3 border-b px-5 py-3 text-sm",
        isWarning
          ? "border-amber-500/20 bg-amber-500/8 text-amber-800 dark:text-amber-300 md:px-8"
          : "border-destructive/20 bg-destructive/5 text-destructive md:px-8"
      )}
    >
      <IconAlertTriangle size={18} className="mt-0.5 shrink-0" />
      <p className="leading-relaxed">{entry.text}</p>
    </div>
  );
}
