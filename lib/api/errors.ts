// A API C-Trip devolve dois formatos de erro diferentes (ver Docs/C-Trip_Guia_Frontend.pdf,
// Referência Rápida #6):
//   - erros de negócio (400/401/403/404/409): { detail: "mensagem legível" }
//   - erros de validação do FastAPI/Pydantic (422): { detail: [{ loc, msg, type }, ...] }
// Todo o resto do código só deve ler `ApiError.message` / `ApiError.fieldErrors`,
// nunca o corpo bruto da resposta — é isso que esta camada garante.

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

export async function parseApiError(response: Response): Promise<ApiError> {
  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    // resposta sem corpo JSON (ex.: erro de rede antes de chegar ao FastAPI) — segue sem `body`
  }

  if (isValidationErrorBody(body)) {
    const fieldErrors: FieldErrors = {};
    for (const issue of body.detail) {
      const field = String(issue.loc.at(-1) ?? "form");
      fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.msg];
    }
    return new ApiError(response.status, "Verifica os campos assinalados.", fieldErrors);
  }

  if (isBusinessErrorBody(body)) {
    return new ApiError(response.status, body.detail);
  }

  return new ApiError(response.status, `Erro inesperado do servidor (${response.status}).`);
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
