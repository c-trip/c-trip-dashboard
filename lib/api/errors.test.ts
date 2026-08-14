import { describe, expect, it } from "vitest";

import { parseApiError } from "./errors";

// A API C-Trip devolve dois formatos de erro diferentes — ver
// Docs/C-Trip_Guia_Frontend.pdf, Referência Rápida #6. Este teste é a garantia
// de que `parseApiError` normaliza os dois para a mesma forma, sempre.

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
        { loc: ["body", "email"], msg: "Formato de email inválido", type: "value_error" },
        { loc: ["body", "password"], msg: "Mínimo 6 caracteres", type: "value_error" },
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
        { loc: ["body", "password"], msg: "Mínimo 6 caracteres", type: "value_error" },
        { loc: ["body", "password"], msg: "Precisa de um número", type: "value_error" },
      ],
    });

    const error = await parseApiError(response);

    expect(error.fieldErrors?.password).toEqual(["Mínimo 6 caracteres", "Precisa de um número"]);
  });

  it("não rebenta com uma resposta sem corpo JSON válido", async () => {
    const response = new Response("<html>502 Bad Gateway</html>", { status: 502 });

    const error = await parseApiError(response);

    expect(error.status).toBe(502);
    expect(error.message).toContain("502");
  });
});
