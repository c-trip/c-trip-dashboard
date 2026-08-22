import { CreateRouteForm } from "./create-route-form";
import { getCities } from "@/lib/api/routes";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";

export default async function NovaRotaPage() {
  await requirePermission(PERMISSIONS.routeCreate);
  const cities = await getCities();

  return (
    <div className="flex max-w-md flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Nova rota</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Origem, destino e preço base — paragens intermédias adicionam-se depois de a rota existir.
        </p>
      </div>
      <CreateRouteForm cities={cities} />
    </div>
  );
}
