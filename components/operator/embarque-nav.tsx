"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

/**
 * Nav do módulo de embarque — validar QR vs manifesto da viagem. Fica no topo,
 * ao lado do selector de viagem, no mesmo registo dos filtros do resto da app.
 */
export function EmbarqueNav({ scheduleId }: { scheduleId?: string }) {
  const pathname = usePathname();
  const onManifest = pathname.includes("/manifesto");

  const items = [
    {
      label: "Validar QR",
      href: scheduleId
        ? `/empresa/embarque?schedule_id=${scheduleId}`
        : "/empresa/embarque",
      active: !onManifest,
      enabled: true,
    },
    {
      label: "Manifesto",
      href: scheduleId ? `/empresa/embarque/${scheduleId}/manifesto` : "#",
      active: onManifest,
      enabled: Boolean(scheduleId),
    },
  ];

  return (
    <nav className="flex rounded-lg border border-border p-0.5">
      {items.map((item) =>
        item.enabled ? (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              item.active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        ) : (
          <span
            key={item.label}
            title="Escolhe uma viagem primeiro"
            className="cursor-not-allowed rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground/50"
          >
            {item.label}
          </span>
        ),
      )}
    </nav>
  );
}
