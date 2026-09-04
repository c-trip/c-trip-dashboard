import { MetricStrip, type Metric } from "@/components/dashboard/metric-strip";
import { PageHeader } from "@/components/layout/page-header";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import {
  getAdminPaymentsSummary,
  getAllCompanies,
  getPendingCompanies,
} from "@/lib/api/admin";
import { formatCurrency } from "@/lib/format";
import { requireRole } from "@/lib/auth/session";

export default async function AdminOverviewPage() {
  await requireRole("admin");
  const [pending, summary, companies] = await Promise.all([
    getPendingCompanies(),
    getAdminPaymentsSummary(),
    getAllCompanies("verified"),
  ]);

  const metrics: Metric[] = [
    {
      label: pending.length === 1 ? "Empresa pendente" : "Empresas pendentes",
      value: pending.length,
      hint: pending.length > 0 ? "Aguardam aprovação" : "Tudo em dia",
      accent: pending.length > 0 ? "warning" : "default",
      href: pending.length > 0 ? "/admin/empresas?tab=pending" : undefined,
    },
    {
      label: "Receita confirmada",
      value: formatCurrency(summary.total_confirmed),
      hint: `${summary.count_confirmed} pagamento(s)`,
      accent: "positive",
      href: "/admin/pagamentos",
    },
    {
      label: "A aguardar confirmação",
      value: formatCurrency(summary.total_pending),
      hint: `${summary.count_pending} pagamento(s)`,
      accent: "warning",
      href: "/admin/pagamentos",
    },
    {
      label: "Empresas verificadas",
      value: companies.length,
      hint: "Transportadoras activas",
      href: "/admin/empresas",
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <PageHeader context="Plataforma" title="Visão geral" />
      <MetricStrip metrics={metrics} />
      <RevenueChart byMonth={summary.by_month} />
    </div>
  );
}
