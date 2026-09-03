import { ChangePasswordForm } from "@/components/account/change-password-form";
import { requireAuth } from "@/lib/auth/session";

export default async function ContaPage() {
  await requireAuth();

  return (
    <div className="flex max-w-md flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          A minha conta
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Altera a palavra-passe de acesso ao painel.
        </p>
      </div>
      <ChangePasswordForm />
    </div>
  );
}
