import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { SectionCards, type SectionCardItem } from "@/components/section-cards";
import { getAdminPaymentsSummary, getAllCompanies, getPendingCompanies } from "@/lib/api/admin";
import { formatCurrency } from "@/lib/format";
import { requireRole } from "@/lib/auth/session";

export default async function AdminOverviewPage() {
  await requireRole("admin");
  const [pending, summary, companies] = await Promise.all([
    getPendingCompanies(),
    getAdminPaymentsSummary(),
    getAllCompanies("verified"),
  ]);

  const cards: SectionCardItem[] = [
    {
      description: pending.length === 1 ? "Empresa pendente" : "Empresas pendentes",
      value: String(pending.length),
      footerTitle: pending.length > 0 ? "Aguardam aprovação" : "Nenhuma pendente",
      footerSubtitle: pending.length > 0 ? "Revisar agora" : "Tudo em dia",
      footerHref: pending.length > 0 ? "/admin/empresas?tab=pending" : undefined,
    },
    {
      description: "Receita confirmada",
      value: formatCurrency(summary.total_confirmed),
      footerTitle: `${summary.count_confirmed} pagamento(s) confirmado(s)`,
      footerSubtitle: "Total acumulado na plataforma",
      footerHref: "/admin/pagamentos",
    },
    {
      description: "A aguardar confirmação",
      value: formatCurrency(summary.total_pending),
      footerTitle: `${summary.count_pending} pagamento(s) pendente(s)`,
      footerSubtitle: "Confirmar manualmente se o webhook falhar",
      footerHref: "/admin/pagamentos",
    },
    {
      description: "Empresas verificadas",
      value: String(companies.length),
      footerTitle: "Transportadoras activas",
      footerSubtitle: "Ver todas as empresas",
      footerHref: "/admin/empresas",
    },
  ];

  return (
    <div className="@container/main -mx-4 flex flex-1 flex-col gap-4 md:-mx-8 md:gap-6 animate-fade-in">
      <SectionCards cards={cards} />
      <div className="px-4 lg:px-6">
        <RevenueChart byMonth={summary.by_month} />
      </div>
    </div>
  );
}
