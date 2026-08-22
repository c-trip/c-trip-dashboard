import { notFound } from "next/navigation";

import { CompanyModerationActions } from "./company-moderation-actions";
import { StatusBadge } from "@/components/feedback/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { getAllCompanies, getPendingCompanies } from "@/lib/api/admin";

export default async function CompanyDetailPage({ params }: PageProps<"/admin/empresas/[companyId]">) {
  const { companyId } = await params;
  const [allCompanies, pendingCompanies] = await Promise.all([getAllCompanies(), getPendingCompanies()]);
  const company = [...pendingCompanies, ...allCompanies].find((c) => c.id === companyId);

  if (!company) {
    notFound();
  }

  const companyType = "company_type" in company ? company.company_type : null;
  const createdAt = "created_at" in company ? company.created_at : null;

  return (
    <div className="flex max-w-lg flex-col gap-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold tracking-tight text-foreground">{company.name}</h2>
        <StatusBadge domain="company" status={company.status} />
      </div>
      <Card>
        <CardContent>
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
            <dt className="font-medium text-muted-foreground">Email</dt>
            <dd>{company.email}</dd>
            <dt className="font-medium text-muted-foreground">Tipo</dt>
            <dd>{companyType ?? "não encontrado"}</dd>
            <dt className="font-medium text-muted-foreground">Registada em</dt>
            <dd>{createdAt ? new Date(createdAt).toLocaleDateString("pt-AO") : "não encontrado"}</dd>
          </dl>
        </CardContent>
      </Card>
      <CompanyModerationActions companyId={company.id} status={company.status} />
    </div>
  );
}
