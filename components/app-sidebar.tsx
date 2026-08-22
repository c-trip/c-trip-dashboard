"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { IconBus } from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { NavItem } from "@/config/nav"
import { NAV_ICONS } from "@/config/nav-icons"
import type { Session } from "@/lib/auth/session"

const DEFAULT_ITEMS: NavItem[] = [{ href: "/dashboard", label: "Dashboard", icon: "dashboard" }]
const DEFAULT_SESSION: Session = { id: "demo", name: "shadcn", email: "m@example.com", role: "admin" }

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  items?: NavItem[]
  sectionLabel?: string
  session?: Session
}

export function AppSidebar({
  items = DEFAULT_ITEMS,
  sectionLabel = "",
  session = DEFAULT_SESSION,
  ...props
}: AppSidebarProps) {
  const pathname = usePathname()

  const navMainItems = items.map((item) => {
    const Icon = NAV_ICONS[item.icon]
    const isActive =
      pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`))
    return {
      title: item.label,
      url: item.href,
      icon: <Icon />,
      isActive,
    }
  })

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<Link href={items[0]?.href ?? "/"} />}
            >
              <IconBus className="size-5!" />
              <span className="text-base font-semibold">C-Trip</span>
              <span className="ms-auto text-xs font-medium text-sidebar-foreground/60">
                {sectionLabel}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ name: session.name, email: session.email }} />
      </SidebarFooter>
    </Sidebar>
  )
}
