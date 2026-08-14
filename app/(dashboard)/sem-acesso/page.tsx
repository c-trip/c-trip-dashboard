import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SemAcessoPage() {
  return (
    <div className="flex min-h-svh flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
      <h1 className="text-lg font-semibold text-foreground">Sem acesso</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        A tua conta não tem permissão para ver esta página. Se achas que devias ter acesso, fala com o gestor da
        tua empresa ou com o suporte da C-Trip.
      </p>
      <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
        Voltar ao início
      </Link>
    </div>
  );
}
