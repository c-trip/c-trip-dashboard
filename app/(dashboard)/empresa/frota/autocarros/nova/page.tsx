import { CreateBusForm } from "./create-bus-form";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";

export default async function NovoAutocarroPage() {
  await requirePermission(PERMISSIONS.busCreate);

  return (
    <div className="flex max-w-md flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Adicionar autocarro</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          O total de lugares é calculado automaticamente: nº de filas × lugares por fila.
        </p>
      </div>
      <CreateBusForm />
    </div>
  );
}
