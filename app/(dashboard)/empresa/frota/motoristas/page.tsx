import { DriverRowActions } from "./driver-row-actions";
import { SimpleTable } from "@/components/tables/simple-table";
import { getDrivers } from "@/lib/api/fleet";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";

export default async function MotoristasPage() {
  await requirePermission(PERMISSIONS.driverRead);
  const drivers = await getDrivers();

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Motoristas</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Associados a contas de colaborador já existentes.
        </p>
      </div>
      <SimpleTable
        rows={drivers}
        rowKey={(driver) => driver.id}
        emptyTitle="Ainda não há motoristas"
        emptyDescription="Cria primeiro a conta em Colaboradores; depois associa-a aqui como motorista."
        columns={[
          { header: "Nome", cell: (d) => <span className="font-medium">{d.name}</span> },
          { header: "Telefone", cell: (d) => d.phone ?? "—" },
          {
            header: "Disponibilidade",
            cell: (d) => (
              <span className={d.available ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-muted-foreground"}>
                {d.available ? "Disponível" : "Indisponível"}
              </span>
            ),
          },
          {
            header: "",
            cell: (d) => <DriverRowActions driverId={d.id} available={d.available} />,
            className: "text-right",
          },
        ]}
      />
    </div>
  );
}
