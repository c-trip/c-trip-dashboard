import { ProfileForm } from "./profile-form";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";

export default async function PerfilPage() {
  await requirePermission(PERMISSIONS.companyUpdateProfile);

  return (
    <div className="flex max-w-md flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Dados da empresa</h2>
        <p className="text-sm text-muted-foreground">
          O backend só expõe escrita (PATCH) deste perfil, sem leitura — por isso o formulário arranca em branco.
        </p>
      </div>
      <ProfileForm />
    </div>
  );
}
