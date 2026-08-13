"use client";

import { useState } from "react";

interface PermissionOption {
  codigo: string;
  descricao: string;
  grupo: string;
}

interface PermissionChecklistProps {
  /** Nome do campo — o Server Action lê todos os valores com `formData.getAll(name)`. */
  name: string;
  options: PermissionOption[];
  defaultSelected: string[];
}

/**
 * Checkboxes agrupadas por `grupo`, para o formulário de "Definir Permissões do
 * Colaborador". Cada gravação SUBSTITUI a lista inteira — por isso não há estado
 * "adicionar"/"remover" incremental aqui, só o conjunto final marcado.
 */
export function PermissionChecklist({ name, options, defaultSelected }: PermissionChecklistProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(defaultSelected));
  const groups = groupBy(options, (option) => option.grupo);

  function toggle(codigo: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(codigo)) {
        next.delete(codigo);
      } else {
        next.add(codigo);
      }
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {Array.from(selected).map((codigo) => (
        <input key={codigo} type="hidden" name={name} value={codigo} />
      ))}
      {Object.entries(groups).map(([grupo, items]) => (
        <fieldset key={grupo} className="flex flex-col gap-2 rounded-lg border border-border p-3.5">
          <legend className="px-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">{grupo}</legend>
          {items.map((item) => (
            <label key={item.codigo} className="flex items-start gap-2.5 text-sm">
              <input
                type="checkbox"
                className="mt-0.5 size-3.5 shrink-0 rounded border-input"
                checked={selected.has(item.codigo)}
                onChange={() => toggle(item.codigo)}
              />
              <span>
                <span className="block font-medium text-foreground">{item.descricao}</span>
                <span className="block text-xs text-muted-foreground">{item.codigo}</span>
              </span>
            </label>
          ))}
        </fieldset>
      ))}
    </div>
  );
}

function groupBy<T>(items: T[], key: (item: T) => string): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    const group = key(item);
    acc[group] = acc[group] ?? [];
    acc[group].push(item);
    return acc;
  }, {});
}
