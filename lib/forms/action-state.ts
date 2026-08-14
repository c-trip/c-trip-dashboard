// Importa de errors.ts, não de client.ts: client.ts é `server-only`, e este
// ficheiro é importado por Client Components só para ler o tipo `ActionState`
// (ex.: create-route-form.tsx) — nunca pode arrastar `next/headers` para o browser.
import { ApiError } from "@/lib/api/errors";

export interface ActionState {
  fieldErrors?: Record<string, string[]>;
  formError?: string;
  success?: boolean;
  redirectTo?: string;
}

export const initialActionState: ActionState = {};

/**
 * Converte qualquer erro apanhado num Server Action para o formato que
 * `<FormField>`/`<FormError>` sabem ler — nunca o corpo bruto da API.
 *
 * Redirects do Next.js (`redirect()`) são implementados internamente como um
 * `throw` com `digest` a começar por "NEXT_REDIRECT"; se os apanhássemos aqui
 * como um erro normal, o redirect nunca aconteceria. Por isso são sempre
 * relançados, nunca convertidos em `formError`.
 */
export function actionErrorState(error: unknown): ActionState {
  if (isNextRedirectError(error)) {
    throw error;
  }

  if (error instanceof ApiError) {
    return {
      fieldErrors: error.fieldErrors,
      formError: error.fieldErrors ? undefined : error.message,
    };
  }

  if (error instanceof Error) {
    return { formError: error.message };
  }

  return { formError: "Ocorreu um erro inesperado." };
}

function isNextRedirectError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}
