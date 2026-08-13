// Isolado de lib/api/client.ts (que é `server-only`) para poder ser importado
// também por proxy.ts, que corre num bundle separado do resto do servidor.
export const SESSION_COOKIE = "ct_session";
