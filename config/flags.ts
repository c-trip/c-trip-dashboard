export const flags = {
  ENABLE_GLOBAL_ROLE_ASSIGNMENT: false,
} as const;

/**
 * `GET /companies/roles` já devolve só o que a empresa pode atribuir (incluindo
 * roles de sistema úteis, como `operador_balcao`). A única que escondemos é a
 * `gestor` — dá acesso total à empresa e não deve ser dada por engano.
 */
export function assignableRoles<T extends { nome: string }>(roles: T[]): T[] {
  if (flags.ENABLE_GLOBAL_ROLE_ASSIGNMENT) return roles;
  return roles.filter((role) => role.nome.toLowerCase().trim() !== "gestor");
}
