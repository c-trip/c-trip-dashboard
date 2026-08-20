import Link from "next/link";
import { IconAlertTriangle } from "@tabler/icons-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CompanyBlockedProps {
  message?: string;
}

export function CompanyBlocked({ message }: CompanyBlockedProps) {
  return (
    <Card className="border-amber-500/20 bg-amber-500/5">
      <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-amber-500/10">
          <IconAlertTriangle size={24} className="text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-bold text-foreground">Empresa pendente de aprovação</h3>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            {message ??
              "A tua empresa ainda não foi aprovada por um administrador da C-Trip. Esta secção ficará disponível assim que a aprovação for concluída."}
          </p>
        </div>
        <Link href="/empresa" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          Voltar ao início
        </Link>
      </CardContent>
    </Card>
  );
}
