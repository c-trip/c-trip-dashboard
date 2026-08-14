import type { ReactNode } from "react";

import { AuthCarousel } from "@/components/auth/auth-carousel";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh bg-muted/40 p-2 lg:gap-2 lg:p-3">
      {/* Painel do formulário */}
      <div className="relative flex w-full flex-col rounded-2xl border-2 bg-card px-4 py-6 text-card-foreground shadow-xs sm:px-10 lg:w-1/2">
        <main className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">{children}</div>
        </main>

        <footer className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>
            © {new Date().getFullYear()}. Todos os direitos reservados.
          </span>
          <span>Portal v1.2.15</span>
        </footer>
      </div>

      {/* Carrossel de destaques */}
      <AuthCarousel />
    </div>
  );
}
