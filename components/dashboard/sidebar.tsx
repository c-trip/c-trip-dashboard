"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconBus } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import type { NavItem } from "@/config/nav";
import { NAV_ICONS } from "@/config/nav-icons";

interface SidebarProps {
  items: NavItem[];
  sectionLabel: string;
}

export function Sidebar({ items, sectionLabel }: SidebarProps) {
  const pathname = usePathname();

  const overviewItem = items[0];
  const menuItems = items.slice(1);

  return (
    <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex md:flex-col">
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <IconBus size={18} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight leading-none">C-Trip</span>
          <span className="mt-0.5 text-[11px] font-medium text-muted-foreground leading-none">{sectionLabel}</span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-6 p-4">
        {overviewItem ? (
          <div className="flex flex-col gap-1">
            {(() => {
              const isActive = pathname === overviewItem.href || (overviewItem.href !== "/" && pathname.startsWith(`${overviewItem.href}/`));
              const Icon = NAV_ICONS[overviewItem.icon];
              return (
                <Link
                  href={overviewItem.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                  {overviewItem.label}
                </Link>
              );
            })()}
          </div>
        ) : null}

        <div className="flex flex-col gap-1">
          <span className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Menu
          </span>
          <div className="flex flex-col gap-0.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = NAV_ICONS[item.icon];
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </aside>
  );
}
