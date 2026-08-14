import Link from "next/link";

import { SimpleTable } from "@/components/tables/simple-table";
import { buttonVariants } from "@/components/ui/button";
import { getAllUsers } from "@/lib/api/admin";
import { cn } from "@/lib/utils";

const LIMIT = 50;

export default async function UtilizadoresPage({ searchParams }: PageProps<"/admin/utilizadores">) {
  const params = await searchParams;
  const offset = Number(params?.offset ?? 0) || 0;
  const users = await getAllUsers(LIMIT, offset);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Utilizadores</h2>
        <p className="text-sm text-muted-foreground">
          Todas as contas da plataforma — passageiros, colaboradores, gestores.
        </p>
      </div>
      <SimpleTable
        rows={users}
        rowKey={(user) => user.id}
        emptyTitle="Nenhum utilizador nesta página"
        columns={[
          { header: "Nome", cell: (u) => u.name },
          { header: "Email", cell: (u) => u.email },
          { header: "Papel", cell: (u) => u.role },
          {
            header: "Estado",
            cell: (u) => (
              <span className={u.is_active ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}>
                {u.is_active ? "Activo" : "Desactivado"}
              </span>
            ),
          },
        ]}
      />
      {/* A API não devolve total de registos — só dá para avançar/recuar, nunca "página X de Y". */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>A mostrar {users.length} a partir de {offset}.</span>
        <div className="flex gap-2">
          {offset > 0 ? (
            <Link
              href={`/admin/utilizadores?offset=${Math.max(offset - LIMIT, 0)}`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Anterior
            </Link>
          ) : null}
          {users.length === LIMIT ? (
            <Link
              href={`/admin/utilizadores?offset=${offset + LIMIT}`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Seguinte
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
