import { ProfileForm } from "./profile-form";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";

export default async function PerfilPage() {
  await requirePermission(PERMISSIONS.companyUpdateProfile);

  return (
    <div className="flex max-w-md flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Dados da empresa</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          O backend só expõe escrita (PATCH) deste perfil, sem leitura — por isso o formulário arranca em branco.
        </p>
      </div>
      <ProfileForm />
    </div>
  );
}
