import { notFound } from "next/navigation";

import { CompanyModerationActions } from "./company-moderation-actions";
import { StatusBadge } from "@/components/feedback/status-badge";
import { getAllCompanies } from "@/lib/api/admin";

export default async function CompanyDetailPage({ params }: PageProps<"/admin/empresas/[companyId]">) {
  const { companyId } = await params;
  // Não há um GET /admin/companies/{id} dedicado — a lista completa é a única fonte.
  const companies = await getAllCompanies();
  const company = companies.find((c) => c.id === companyId);

  if (!company) {
    notFound();
  }

  return (
    <div className="flex max-w-lg flex-col gap-4">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-foreground">{company.name}</h2>
        <StatusBadge domain="company" status={company.status} />
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
        <dt className="text-muted-foreground">Email</dt>
        <dd>{company.email}</dd>
        <dt className="text-muted-foreground">Tipo</dt>
        <dd>{company.company_type}</dd>
        <dt className="text-muted-foreground">Registada em</dt>
        <dd>{new Date(company.created_at).toLocaleDateString("pt-AO")}</dd>
      </dl>
      <CompanyModerationActions companyId={company.id} status={company.status} />
    </div>
  );
}
