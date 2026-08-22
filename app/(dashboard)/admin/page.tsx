import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards, type SectionCardItem } from "@/components/section-cards";
import { getPendingCompanies } from "@/lib/api/admin";
import { requireRole } from "@/lib/auth/session";

import data from "@/app/dashboard/data.json";

export default async function AdminOverviewPage() {
  await requireRole("admin");
  const pending = await getPendingCompanies();

  const cards: SectionCardItem[] = [
    {
      description: pending.length === 1 ? "Empresa pendente" : "Empresas pendentes",
      value: String(pending.length),
      footerTitle: pending.length > 0 ? "Aguardam aprovação" : "Nenhuma pendente",
      footerSubtitle: pending.length > 0 ? "Revisar agora" : "Tudo em dia",
      footerHref: pending.length > 0 ? "/admin/empresas?tab=pending" : undefined,
    },
    {
      description: "Receita total",
      value: "1 250 000 Kz",
      trend: "up",
      trendValue: "+12.5%",
      footerTitle: "Em crescimento este mês",
      footerSubtitle: "Pagamentos dos últimos 6 meses",
    },
    {
      description: "Empresas activas",
      value: "45",
      trend: "up",
      trendValue: "+4.5%",
      footerTitle: "Retenção sólida",
      footerSubtitle: "Acima da meta prevista",
    },
    {
      description: "Utilizadores registados",
      value: "1 234",
      trend: "down",
      trendValue: "-20%",
      footerTitle: "Abrandou este período",
      footerSubtitle: "Aquisição precisa de atenção",
    },
  ];

  return (
    <div className="@container/main -mx-4 flex flex-1 flex-col gap-4 md:-mx-8 md:gap-6 animate-fade-in">
      <SectionCards cards={cards} />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </div>
  );
}
