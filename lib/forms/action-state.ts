import { ApiError } from "@/lib/api/errors";

export interface ActionState {
  fieldErrors?: Record<string, string[]>;
  formError?: string;
  success?: boolean;
}

export const initialActionState: ActionState = {};

export function actionErrorState(error: unknown): ActionState {
  if (isNextRedirectError(error)) {
    throw error;
  }

  if (error instanceof ApiError) {
    return {
      fieldErrors: error.fieldErrors,
      // `info.msg` traduz o status/detail (403 sem permissão ≠ empresa por aprovar).
      formError: error.fieldErrors ? undefined : error.info.msg,
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
