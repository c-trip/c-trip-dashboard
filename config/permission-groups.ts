/**
 * Rótulos em português para os grupos de permissões que o backend devolve em
 * `GET /companies/permissions` (`grupo`). Ordem = como aparecem na checklist —
 * operação primeiro, gestão da empresa depois. Grupos desconhecidos caem no fim
 * com o nome cru.
 */
const GROUP_LABELS: Record<string, string> = {
  booking: "Bilhetes e balcão",
  boarding: "Embarque",
  finance: "Financeiro",
  payment: "Pagamentos",
  route: "Rotas",
  schedule: "Horários",
  bus: "Autocarros",
  driver: "Motoristas",
  task: "Tarefas",
  company: "Empresa e colaboradores",
};

const GROUP_ORDER = Object.keys(GROUP_LABELS);

export function groupLabel(grupo: string): string {
  return GROUP_LABELS[grupo] ?? grupo;
}

/** Comparador para ordenar grupos: conhecidos pela ordem definida, resto no fim por nome. */
export function compareGroups(a: string, b: string): number {
  const ia = GROUP_ORDER.indexOf(a);
  const ib = GROUP_ORDER.indexOf(b);
  if (ia === -1 && ib === -1) return a.localeCompare(b);
  if (ia === -1) return 1;
  if (ib === -1) return -1;
  return ia - ib;
}
