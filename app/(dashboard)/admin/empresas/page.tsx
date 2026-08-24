import Link from "next/link";

import { CompanyRowActions } from "./company-row-actions";
import { SimpleTable } from "@/components/tables/simple-table";
import { StatusBadge } from "@/components/feedback/status-badge";
import { getAllCompanies, getPendingCompanies, type AdminCompany, type PendingCompany } from "@/lib/api/admin";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "all", label: "Todas" },
  { key: "pending", label: "Pendentes" },
] as const;

export default async function EmpresasPage({ searchParams }: PageProps<"/admin/empresas">) {
  const params = await searchParams;
  const tab = params?.tab === "pending" ? "pending" : "all";
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
          {
            header: "Tipo",
            cell: (c) => ("company_type" in c ? <span>{c.company_type}</span> : <span className="text-muted-foreground">—</span>),
          },
          {
            header: "Registada em",
            cell: (c) => (
              <span className="tabular-nums whitespace-nowrap">
                {"created_at" in c ? new Date(c.created_at).toLocaleDateString("pt-AO") : <span className="text-muted-foreground">—</span>}
              </span>
            ),
          },
          { header: "Estado", cell: (c) => <StatusBadge domain="company" status={c.status} /> },
          {
            header: "",
            cell: (c) => <CompanyRowActions companyId={c.id} companyName={c.name} status={c.status} />,
            className: "text-right",
          },
        ]}
      />
    </div>
  );
}
