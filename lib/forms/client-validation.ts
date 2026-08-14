export interface InvalidFields {
  empty: string[];
  invalid: string[];
}

export function collectInvalidFields(
  form: HTMLFormElement,
  labelFor: (name: string) => string | undefined,
): InvalidFields {
  const result: InvalidFields = { empty: [], invalid: [] };

  for (const el of form.elements) {
    if (
      !(el instanceof HTMLInputElement) &&
      !(el instanceof HTMLSelectElement) &&
      !(el instanceof HTMLTextAreaElement)
    ) {
      continue;
    }
    if (el.disabled || el.type === "hidden") continue;
    if (el.checkValidity()) continue;

    const label = labelFor(el.name || el.id) ?? (el.name || el.id);
    if (el.value.trim() === "") {
      result.empty.push(label);
    } else {
      result.invalid.push(label);
    }
  }

  return result;
}

export function invalidFieldsMessage(result: InvalidFields): string {
  const parts: string[] = [];
  if (result.empty.length > 0) {
    parts.push(`Preenche os campos em falta: ${result.empty.join(", ")}.`);
  }
  if (result.invalid.length > 0) {
    parts.push(
      `Corrige os campos com valores inválidos: ${result.invalid.join(", ")}.`,
    );
  }
  return parts.join(" ");
}
