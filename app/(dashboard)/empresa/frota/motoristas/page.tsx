import { SimpleTable } from "@/components/tables/simple-table";
import { getDrivers } from "@/lib/api/fleet";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";

export default async function MotoristasPage() {
  await requirePermission(PERMISSIONS.driverRead);
  const drivers = await getDrivers();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Motoristas</h2>
        <p className="text-sm text-muted-foreground">Associados a contas de colaborador já existentes.</p>
      </div>
      <SimpleTable
        rows={drivers}
        rowKey={(driver) => driver.id}
        emptyTitle="Ainda não há motoristas"
        emptyDescription="Cria primeiro a conta em Colaboradores; depois associa-a aqui como motorista."
        columns={[
          { header: "Nome", cell: (d) => d.name },
          { header: "Telefone", cell: (d) => d.phone ?? "—" },
          {
            header: "Disponibilidade",
            cell: (d) => (
              <span className={d.available ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}>
                {d.available ? "Disponível" : "Indisponível"}
              </span>
            ),
          },
        ]}
      />
    </div>
  );
}
