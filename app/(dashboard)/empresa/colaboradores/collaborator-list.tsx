"use client";

import { useMemo, useState } from "react";
import {
  IconCheck,
  IconChevronDown,
  IconFilter,
  IconSearch,
} from "@tabler/icons-react";

import { CollaboratorRowActions } from "./collaborator-row-actions";
import { SimpleTable } from "@/components/tables/simple-table";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { CompanyUser } from "@/lib/api/companies";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "active" | "inactive";

const STATUS: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Activos" },
  { value: "inactive", label: "Desactivados" },
];

export function CollaboratorList({ users }: { users: CompanyUser[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return users.filter((u) => {
      if (status === "active" && !u.is_active) return false;
      if (status === "inactive" && u.is_active) return false;
      if (!needle) return true;
      return (
        u.name.toLowerCase().includes(needle) ||
        u.email.toLowerCase().includes(needle)
      );
    });
  }, [users, query, status]);

  const statusLabel = STATUS.find((s) => s.value === status)!.label;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-48 flex-1">
          <IconSearch
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Procurar por nome ou email"
            className="ps-9"
          />
        </div>
        <Popover>
          <PopoverTrigger
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "gap-1.5",
            )}
          >
            <IconFilter size={16} />
            {status === "all" ? "Estado" : statusLabel}
            <IconChevronDown size={14} className="text-muted-foreground" />
          </PopoverTrigger>
          <PopoverContent align="end" className="w-44">
            <div className="flex flex-col gap-0.5">
              {STATUS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStatus(s.value)}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition-colors hover:bg-muted",
                    status === s.value && "font-medium text-primary",
                  )}
                >
                  {s.label}
                  {status === s.value ? <IconCheck size={15} /> : null}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <SimpleTable
        rows={rows}
        rowKey={(user) => user.id}
        emptyTitle={
          query || status !== "all"
            ? "Sem resultados"
            : "Ainda não há colaboradores"
        }
        emptyDescription={
          query || status !== "all"
            ? "Nenhum colaborador corresponde aos filtros."
            : "Adiciona o primeiro colaborador para começar a atribuir tarefas e permissões."
        }
        columns={[
          {
            header: "Nome",
            cell: (u) => <span className="font-medium">{u.name}</span>,
          },
          { header: "Email", cell: (u) => u.email },
          {
            header: "Estado",
            cell: (u) => (
              <span
                className={
                  u.is_active
                    ? "font-medium text-emerald-600 dark:text-emerald-400"
                    : "text-muted-foreground"
                }
              >
                {u.is_active ? "Activo" : "Desactivado"}
              </span>
            ),
          },
          {
            header: "",
            cell: (u) => <CollaboratorRowActions userId={u.id} name={u.name} />,
            className: "text-right",
          },
        ]}
      />
    </div>
  );
}
