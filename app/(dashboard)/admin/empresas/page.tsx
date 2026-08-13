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
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Empresas</h2>
        <p className="text-sm text-muted-foreground">Aprovação e supervisão das transportadoras registadas.</p>
      </div>
      <div className="flex gap-1.5">
        {TABS.map((item) => (
          <Link
            key={item.key}
            href={`/admin/empresas?tab=${item.key}`}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium",
              tab === item.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
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
              <Link href={`/admin/empresas/${c.id}`} className="font-medium hover:underline">
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
