import { CreateTaskForm } from "./create-task-form";
import { TaskRowActions } from "./task-row-actions";
import { ApiErrorState } from "@/components/feedback/api-error-state";
import { SimpleTable } from "@/components/tables/simple-table";
import { StatusBadge } from "@/components/feedback/status-badge";
import { getMyTasks } from "@/lib/api/fleet";
import { getCompanyUsers } from "@/lib/api/companies";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { can, requireAuth } from "@/lib/auth/session";

export default async function TarefasPage() {
  await requireAuth();
  const canCreate = await can(PERMISSIONS.taskCreate);

  let tasks;
  let users;
  try {
    [tasks, users] = await Promise.all([
      getMyTasks(),
      canCreate ? getCompanyUsers() : Promise.resolve([]),
    ]);
  } catch (error) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Tarefas
          </h2>
        </div>
        <ApiErrorState error={error} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Tarefas
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tarefas operacionais atribuídas à equipa de frota.
        </p>
      </div>

      {canCreate ? <CreateTaskForm users={users} /> : null}

      <SimpleTable
        rows={tasks}
        rowKey={(task) => task.id}
        emptyTitle="Sem tarefas"
        emptyDescription={
          canCreate
            ? "Cria a primeira tarefa e atribui-a a um colaborador."
            : "Não tens tarefas atribuídas de momento."
        }
        columns={[
          {
            header: "Título",
            cell: (t) => <span className="font-medium">{t.title}</span>,
          },
          {
            header: "Estado",
            cell: (t) => <StatusBadge domain="task" status={t.status} />,
          },
          {
            header: "",
            cell: (t) => (
              <TaskRowActions taskId={t.id} currentStatus={t.status} />
            ),
            className: "text-right",
          },
        ]}
      />
    </div>
  );
}
