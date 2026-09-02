"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Filtro por data única (query param `date`). Ao mudar, actualiza o URL — o
 * Server Component re-pede os dados. Botão para voltar a "hoje".
 */
export function DateFilter({
  initial,
  label = "Data",
}: {
  initial?: string;
  label?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setDate(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("date", value);
    else params.delete("date");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-2">
        <Label htmlFor="date-filter" className="text-sm font-semibold">
          {label}
        </Label>
        <Input
          id="date-filter"
          type="date"
          defaultValue={initial ?? ""}
          onChange={(e) => setDate(e.target.value)}
          className="w-44"
        />
      </div>
      {initial ? (
        <button
          type="button"
          onClick={() => setDate("")}
          className="h-10 text-sm text-muted-foreground hover:text-foreground"
        >
          Hoje
        </button>
      ) : null}
    </div>
  );
}
