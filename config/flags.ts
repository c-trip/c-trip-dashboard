/**
 * Feature flags que existem para encapsular lacunas conhecidas do backend
 * (ver Docs/C-Trip_Guia_Frontend.pdf, avisos gerais #4). Cada flag tem UM sítio
 * de leitura — nunca espalhar `if`s equivalentes por vários componentes.
 */
export const flags = {
  /**
   * "Roles da Empresa" permite hoje atribuir a role global "gestor" (acesso total)
   * a qualquer colaborador sem restrição — o backend ainda não bloqueia isto.
   * Mantém desligado até a equipa de backend confirmar a correcção.
   */
  ENABLE_GLOBAL_ROLE_ASSIGNMENT: false,
} as const;
