export type FieldErrors = Record<string, string[]>;

/**
 * Categoria de um erro da API, deduzida de `status` + `detail`. Decide o que o
 * UI mostra — em particular, **só** `company_pending`/`company_suspended` devem
 * levar à mensagem de "empresa por aprovar". Um 403 comum é falta de permissão.
 */
export type ApiErrorKind =
  | "auth" // 401 — sessão inválida/expirada
  | "company_pending" // 403 — empresa aguarda aprovação
  | "company_suspended" // 403 — empresa suspensa
  | "forbidden" // 403 — utilizador sem permissão
  | "business" // 400/404/409/422 — erro de negócio (mostrar o detail)
  | "server"; // 5xx / sem resposta

export interface ApiErrorInfo {
  kind: ApiErrorKind;
  msg: string;
}

/** Função pura: (status, detail) → { kind, msg }. Ver tabela no README/issue. */
export function apiErrorMessage(
  status: number,
  detail?: string | null,
): ApiErrorInfo {
  const raw = (detail ?? "").trim();
  const d = raw.toLowerCase();
  const has = (...needles: string[]) => needles.some((n) => d.includes(n));

  if (status === 401) {
    return { kind: "auth", msg: "A tua sessão expirou. Entra de novo." };
  }

  if (status === 403) {
    if (
      has(
        "não aprovada",
        "nao aprovada",
        "aguarde aprovação",
        "aguarde aprovacao",
        "aguarda aprovação",
        "aguarda aprovacao",
      )
    ) {
      return {
        kind: "company_pending",
        msg: "A empresa aguarda aprovação do administrador.",
      };
    }
    if (has("suspensa", "suspenso")) {
      return {
        kind: "company_suspended",
        msg: "Empresa suspensa. Contacte a plataforma.",
      };
    }
    return {
      kind: "forbidden",
      msg:
        raw ||
        "Não tens permissão para esta ação. Contacta o gestor da empresa.",
    };
  }

  if (status === 400 || status === 404 || status === 409 || status === 422) {
    return {
      kind: "business",
      msg: raw || "Não foi possível concluir a operação.",
    };
  }

  return { kind: "server", msg: "Ocorreu um erro. Tenta de novo." };
}

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors?: FieldErrors;
  /** `detail` cru devolvido pela API (quando é uma string). */
  readonly detail?: string;

  constructor(
    status: number,
    message: string,
    fieldErrors?: FieldErrors,
    detail?: string,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
    this.detail = detail;
  }

  /** Categoria + mensagem prontas para o UI. */
  get info(): ApiErrorInfo {
    return apiErrorMessage(this.status, this.detail ?? this.message);
  }
}

interface BusinessErrorBody {
  detail: string;
}

interface ValidationErrorBody {
  detail: Array<{ loc: Array<string | number>; msg: string; type: string }>;
}

type ErrorSource =
  | { status: number; json: () => Promise<unknown> }
  | { status: number; data: unknown };

async function readBody(source: ErrorSource): Promise<unknown> {
  if ("data" in source) return source.data;
  try {
    return await source.json();
  } catch {
    // resposta sem corpo JSON (ex.: erro de rede antes de chegar ao FastAPI) — segue sem `body`
    return null;
  }
}

export async function parseApiError(response: ErrorSource): Promise<ApiError> {
  const body = await readBody(response);

  if (isValidationErrorBody(body)) {
    const fieldErrors: FieldErrors = {};
    for (const issue of body.detail) {
      const field = String(issue.loc.at(-1) ?? "form");
      fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.msg];
    }
    return new ApiError(
      response.status,
      "Verifica os campos assinalados.",
      fieldErrors,
    );
  }

  if (isBusinessErrorBody(body)) {
    return new ApiError(response.status, body.detail, undefined, body.detail);
  }

  return new ApiError(
    response.status,
    `Erro inesperado do servidor (${response.status}).`,
  );
}

function isBusinessErrorBody(body: unknown): body is BusinessErrorBody {
  return (
    !!body &&
    typeof body === "object" &&
    "detail" in body &&
    typeof (body as { detail: unknown }).detail === "string"
  );
}

function isValidationErrorBody(body: unknown): body is ValidationErrorBody {
  return (
    !!body &&
    typeof body === "object" &&
    "detail" in body &&
    Array.isArray((body as { detail: unknown }).detail)
  );
}
