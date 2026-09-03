"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { format, isToday, isTomorrow, parseISO } from "date-fns";
import { pt } from "date-fns/locale";
import { IconCalendarEvent, IconChevronDown } from "@tabler/icons-react";

import { buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function label(value?: string): string {
  if (!value) return "Hoje";
  const date = parseISO(value);
  if (isToday(date)) return "Hoje";
  if (isTomorrow(date)) return "Amanhã";
  return format(date, "d 'de' MMM", { locale: pt });
}

/**
 * Selector de uma data única na query string (`?date=`), no mesmo estilo do
 * filtro do fluxo de caixa: um botão que abre calendário + atalhos.
 */
export function DatePickerButton({
  value,
  param = "date",
}: {
  value?: string;
  param?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  function push(next?: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (next) params.set(param, next);
    else params.delete(param);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
    setOpen(false);
  }

  const selected = value ? parseISO(value) : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "gap-1.5",
        )}
      >
        <IconCalendarEvent size={16} />
        {label(value)}
        <IconChevronDown size={14} className="text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3">
        <div className="mb-2 flex gap-1">
          <button
            type="button"
            onClick={() => push(undefined)}
            className="flex-1 rounded-lg px-2.5 py-1.5 text-sm transition-colors hover:bg-muted"
          >
            Hoje
          </button>
          <button
            type="button"
            onClick={() => {
              const d = new Date();
              d.setDate(d.getDate() + 1);
              push(format(d, "yyyy-MM-dd"));
            }}
            className="flex-1 rounded-lg px-2.5 py-1.5 text-sm transition-colors hover:bg-muted"
          >
            Amanhã
          </button>
        </div>
        <Calendar
          mode="single"
          locale={pt}
          selected={selected}
          defaultMonth={selected}
          onSelect={(date) =>
            push(date ? format(date, "yyyy-MM-dd") : undefined)
          }
        />
      </PopoverContent>
    </Popover>
  );
}
