import { IconAlertTriangle } from "@tabler/icons-react";

import type { CompanyStatus } from "@/lib/api/types";

const MESSAGES: Partial<Record<CompanyStatus, string>> = {
  pending: "A tua empresa está a aguardar aprovação da C-Trip. Algumas acções podem continuar disponíveis, mas os bilhetes só ficam visíveis ao público depois da aprovação.",
  suspended: "A tua empresa está suspensa pela C-Trip. Contacta o suporte para regularizar a situação.",
  rejected: "O registo desta empresa foi rejeitado pela C-Trip. Contacta o suporte para mais informação.",
};

interface CompanyStatusBannerProps {
  status: CompanyStatus;
}

// Fica sempre visível quando a empresa não está "verified" — independentemente
// de o backend bloquear ou não a acção em causa (ver Docs/C-Trip_Guia_Frontend.pdf,
// aviso sobre empresas "pending"/"suspended" ainda não bloqueadas em tudo).
export function CompanyStatusBanner({ status }: CompanyStatusBannerProps) {
  const message = MESSAGES[status];
  if (!message) return null;

  return (
    <div className="flex items-start gap-2.5 border-b border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-800 dark:text-amber-300 md:px-6">
      <IconAlertTriangle size={17} className="mt-0.5 shrink-0" />
      <p>{message}</p>
    </div>
  );
}
