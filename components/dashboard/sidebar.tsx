"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import type { NavItem } from "@/config/nav";
import { NAV_ICONS } from "@/config/nav-icons";

interface SidebarProps {
  /** Já filtrados por permissão no servidor — a sidebar nunca decide quem vê o quê. */
  items: NavItem[];
  sectionLabel: string;
}

export function Sidebar({ items, sectionLabel }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border bg-sidebar text-sidebar-foreground md:flex md:flex-col">
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <span className="text-sm font-semibold tracking-tight">C-Trip</span>
        <span className="ms-2 rounded-md bg-sidebar-accent px-1.5 py-0.5 text-[11px] font-medium text-sidebar-accent-foreground">
          {sectionLabel}
        </span>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 p-2">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = NAV_ICONS[item.icon];
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
