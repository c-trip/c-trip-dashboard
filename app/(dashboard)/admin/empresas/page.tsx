import Link from "next/link";

import { SimpleTable } from "@/components/tables/simple-table";
import { StatusBadge } from "@/components/feedback/status-badge";
import { getAllCompanies, getPendingCompanies, type AdminCompany, type PendingCompany } from "@/lib/api/admin";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "pending", label: "Pendentes" },
  { key: "all", label: "Todas" },
] as const;

export default async function EmpresasPage({ searchParams }: PageProps<"/admin/empresas">) {
  const params = await searchParams;
  const tab = params?.tab === "all" ? "all" : "pending";
  const companies: (PendingCompany | AdminCompany)[] =
    tab === "pending" ? await getPendingCompanies() : await getAllCompanies();

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Empresas</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Aprovação e supervisão das transportadoras registadas.
        </p>
      </div>
      <div className="flex gap-1 rounded-lg bg-muted/60 p-1 w-fit">
        {TABS.map((item) => (
          <Link
            key={item.key}
            href={`/admin/empresas?tab=${item.key}`}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm font-medium transition-all duration-200",
              tab === item.key
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <SimpleTable
        rows={companies}
        rowKey={(company) => company.id}
        emptyTitle={tab === "pending" ? "Nenhuma empresa pendente" : "Nenhuma empresa registada"}
        columns={[
          {
            header: "Nome",
            cell: (c) => (
              <Link href={`/admin/empresas/${c.id}`} className="font-medium text-primary hover:underline">
                {c.name}
              </Link>
            ),
          },
          { header: "Email", cell: (c) => c.email },
          { header: "Estado", cell: (c) => <StatusBadge domain="company" status={c.status} /> },
        ]}
      />
    </div>
  );
}
