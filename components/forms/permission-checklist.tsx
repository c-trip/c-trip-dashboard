"use client";

import { useMemo, useState } from "react";
import { IconSearch } from "@tabler/icons-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { compareGroups, groupLabel } from "@/config/permission-groups";
import { cn } from "@/lib/utils";

interface PermissionOption {
  codigo: string;
  descricao: string;
  grupo: string;
}

interface PermissionChecklistProps {
  name: string;
  options: PermissionOption[];
  defaultSelected: string[];
}

export function PermissionChecklist({
  name,
  options,
  defaultSelected,
}: PermissionChecklistProps) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(defaultSelected),
  );
  const [query, setQuery] = useState("");

  const groups = useMemo(() => {
    const byGroup = new Map<string, PermissionOption[]>();
    for (const option of options) {
      const list = byGroup.get(option.grupo) ?? [];
      list.push(option);
      byGroup.set(option.grupo, list);
    }
    return [...byGroup.entries()]
      .sort((a, b) => compareGroups(a[0], b[0]))
      .map(([grupo, items]) => ({ grupo, items }));
  }, [options]);

  const needle = query.trim().toLowerCase();
  const matches = (option: PermissionOption) =>
    !needle ||
    option.descricao.toLowerCase().includes(needle) ||
    option.codigo.toLowerCase().includes(needle);

  function setMany(codigos: string[], on: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const codigo of codigos) {
        if (on) next.add(codigo);
        else next.delete(codigo);
      }
      return next;
    });
  }

  const visibleGroups = groups
    .map((group) => ({ ...group, items: group.items.filter(matches) }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="flex flex-col gap-3">
      {[...selected].map((codigo) => (
        <input key={codigo} type="hidden" name={name} value={codigo} />
      ))}

      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <IconSearch
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Procurar permissão"
            className="ps-9"
          />
        </div>
        <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
          {selected.size} escolhida{selected.size === 1 ? "" : "s"}
        </span>
      </div>

      <div className="divide-y divide-border overflow-hidden rounded-xl border border-border">
        {visibleGroups.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">
            Nenhuma permissão corresponde a “{query}”.
          </p>
        ) : (
          visibleGroups.map((group) => {
            const codes = group.items.map((item) => item.codigo);
            const chosen = codes.filter((codigo) =>
              selected.has(codigo),
            ).length;
            const allOn = chosen === codes.length;
            return (
              <fieldset key={group.grupo} className="flex flex-col">
                <div className="flex items-center justify-between gap-3 bg-muted/40 px-4 py-2">
                  <legend className="text-sm font-semibold text-foreground">
                    {groupLabel(group.grupo)}
                    <span className="ms-2 font-normal text-muted-foreground tabular-nums">
                      {chosen}/{codes.length}
                    </span>
                  </legend>
                  <button
                    type="button"
                    onClick={() => setMany(codes, !allOn)}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    {allOn ? "Limpar" : "Selecionar tudo"}
                  </button>
                </div>
                <div className="flex flex-col">
                  {group.items.map((item) => {
                    const isOn = selected.has(item.codigo);
                    return (
                      <label
                        key={item.codigo}
                        className={cn(
                          "flex cursor-pointer items-start gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-muted/40",
                          isOn && "bg-primary/5",
                        )}
                      >
                        <Checkbox
                          checked={isOn}
                          onCheckedChange={(checked) =>
                            setMany([item.codigo], checked === true)
                          }
                          className="mt-0.5"
                        />
                        <span className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {item.descricao}
                          </span>
                          <span className="font-mono text-xs text-muted-foreground">
                            {item.codigo}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            );
          })
        )}
      </div>
    </div>
  );
}
