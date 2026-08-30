export type FieldErrors = Record<string, string[]>;

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors?: FieldErrors;

  constructor(status: number, message: string, fieldErrors?: FieldErrors) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
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
    return new ApiError(response.status, body.detail);
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
