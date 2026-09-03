import { describe, expect, it } from "vitest";

import { apiErrorMessage, parseApiError } from "./errors";

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), { status });
}

describe("parseApiError", () => {
  it("converte um erro de negócio ({ detail: string }) em ApiError.message", async () => {
    const response = jsonResponse(404, { detail: "Reserva não encontrada" });

    const error = await parseApiError(response);

    expect(error.status).toBe(404);
    expect(error.message).toBe("Reserva não encontrada");
    expect(error.fieldErrors).toBeUndefined();
  });

  it("converte um erro de validação do Pydantic (422) em fieldErrors por campo", async () => {
    const response = jsonResponse(422, {
      detail: [
        {
          loc: ["body", "email"],
          msg: "Formato de email inválido",
          type: "value_error",
        },
        {
          loc: ["body", "password"],
          msg: "Mínimo 6 caracteres",
          type: "value_error",
        },
      ],
    });

    const error = await parseApiError(response);

    expect(error.status).toBe(422);
    expect(error.fieldErrors).toEqual({
      email: ["Formato de email inválido"],
      password: ["Mínimo 6 caracteres"],
    });
  });

  it("agrupa múltiplas mensagens de validação para o mesmo campo", async () => {
    const response = jsonResponse(422, {
      detail: [
        {
          loc: ["body", "password"],
          msg: "Mínimo 6 caracteres",
          type: "value_error",
        },
        {
          loc: ["body", "password"],
          msg: "Precisa de um número",
          type: "value_error",
        },
      ],
    });

    const error = await parseApiError(response);

    expect(error.fieldErrors?.password).toEqual([
      "Mínimo 6 caracteres",
      "Precisa de um número",
    ]);
  });

  it("não rebenta com uma resposta sem corpo JSON válido", async () => {
    const response = new Response("<html>502 Bad Gateway</html>", {
      status: 502,
    });

    const error = await parseApiError(response);

    expect(error.status).toBe(502);
    expect(error.message).toContain("502");
  });

  it("guarda o `detail` cru num erro de negócio, para o mapeamento posterior", async () => {
    const response = jsonResponse(403, {
      detail: "Permissão 'booking:sell' em falta",
    });

    const error = await parseApiError(response);

    expect(error.detail).toBe("Permissão 'booking:sell' em falta");
    expect(error.info.kind).toBe("forbidden");
  });
});

describe("apiErrorMessage", () => {
  it("401 → auth (sessão expirada), independentemente do detail", () => {
    expect(apiErrorMessage(401, "invalid token").kind).toBe("auth");
    expect(apiErrorMessage(401, "Conta desactivada").kind).toBe("auth");
    expect(apiErrorMessage(401, "").kind).toBe("auth");
  });

  it("403 com 'não aprovada' / 'aguarde aprovação' → company_pending", () => {
    expect(apiErrorMessage(403, "Empresa ainda não aprovada")).toEqual({
      kind: "company_pending",
      msg: "A empresa aguarda aprovação do administrador.",
    });
    expect(
      apiErrorMessage(403, "Aguarde aprovação do administrador").kind,
    ).toBe("company_pending");
  });

  it("403 com 'suspensa' → company_suspended", () => {
    expect(apiErrorMessage(403, "Empresa suspensa")).toEqual({
      kind: "company_suspended",
      msg: "Empresa suspensa. Contacte a plataforma.",
    });
  });

  it("403 sem palavras-chave → forbidden, mostrando o detail", () => {
    expect(apiErrorMessage(403, "Precisas da permissão booking:sell")).toEqual({
      kind: "forbidden",
      msg: "Precisas da permissão booking:sell",
    });
  });

  it("403 sem detail → forbidden com mensagem genérica de permissão", () => {
    expect(apiErrorMessage(403, "")).toEqual({
      kind: "forbidden",
      msg: "Não tens permissão para esta ação. Contacta o gestor da empresa.",
    });
  });

  it("400/404/409/422 → business, com o detail tal como vem", () => {
    for (const status of [400, 404, 409, 422]) {
      expect(apiErrorMessage(status, "Lugar já reservado")).toEqual({
        kind: "business",
        msg: "Lugar já reservado",
      });
    }
  });

  it("5xx / status 0 (sem resposta) → server, mensagem genérica", () => {
    expect(apiErrorMessage(500, "stack trace…").kind).toBe("server");
    expect(apiErrorMessage(0).kind).toBe("server");
    expect(apiErrorMessage(503).msg).toBe("Ocorreu um erro. Tenta de novo.");
  });

  it("é case-insensitive nas palavras-chave do 403", () => {
    expect(apiErrorMessage(403, "EMPRESA NÃO APROVADA").kind).toBe(
      "company_pending",
    );
    expect(apiErrorMessage(403, "Empresa SUSPENSA").kind).toBe(
      "company_suspended",
    );
  });
});
