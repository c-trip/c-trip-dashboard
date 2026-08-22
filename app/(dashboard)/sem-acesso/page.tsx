import Link from "next/link";
import { IconLock } from "@tabler/icons-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SemAcessoPage() {
  return (
    <div className="flex min-h-svh flex-1 flex-col items-center justify-center gap-6 px-4 text-center animate-fade-in">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-muted/60">
        <IconLock size={32} className="text-muted-foreground/60" />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Sem acesso</h1>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          A tua conta não tem permissão para ver esta página. Se achas que devias ter acesso, fala com o gestor da
          tua empresa ou com o suporte da C-Trip.
        </p>
      </div>
      <Link href="/" className={cn(buttonVariants({ variant: "default" }))}>
        Voltar ao início
      </Link>
    </div>
  );
}
