import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards, type SectionCardItem } from "@/components/section-cards";
import { requireAuth } from "@/lib/auth/session";

import data from "@/app/dashboard/data.json";

const CARDS: SectionCardItem[] = [
  {
    description: "Receita do mês",
    value: "320 000 Kz",
    trend: "up",
    trendValue: "+12.5%",
    footerTitle: "Em crescimento este mês",
    footerSubtitle: "Pagamentos dos últimos 6 meses",
  },
  {
    description: "Bilhetes vendidos",
    value: "1 234",
    trend: "down",
    trendValue: "-20%",
    footerTitle: "Abrandou este período",
    footerSubtitle: "Precisa de atenção",
  },
  {
    description: "Rotas activas",
    value: "18",
    trend: "up",
    trendValue: "+12.5%",
    footerTitle: "Boa cobertura",
    footerSubtitle: "Acima da meta prevista",
  },
  {
    description: "Autocarros em operação",
    value: "12",
    trend: "up",
    trendValue: "+4.5%",
    footerTitle: "Frota estável",
    footerSubtitle: "Sem falhas reportadas",
  },
];

export default async function EmpresaOverviewPage() {
  await requireAuth();

  return (
    <div className="@container/main -mx-4 flex flex-1 flex-col gap-4 md:-mx-8 md:gap-6 animate-fade-in">
      <SectionCards cards={CARDS} />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </div>
  );
}
