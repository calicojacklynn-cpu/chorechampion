"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ListTodo,
  Gift,
  Calendar,
  Sparkles,
} from "lucide-react";

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent
} from "@/components/ui/sidebar";
import { ChoreChampionLogo } from "./ChoreChampionLogo";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/champions", icon: Users, label: "Champions" },
  { href: "/dashboard/chores", icon: ListTodo, label: "Chores" },
  { href: "/dashboard/rewards", icon: Gift, label: "Rewards" },
  { href: "/dashboard/calendar", icon: Calendar, label: "Calendar" },
  { href: "/dashboard/scheduler", icon: Sparkles, label: "AI Scheduler" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="group-data-[collapsible=icon]:justify-center">
        <Link href="/dashboard" className="flex items-center gap-2">
            <ChoreChampionLogo className="h-8 w-8" />
            <span className="font-bold font-headline text-lg group-data-[collapsible=icon]:hidden">Chore Champion</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  isActive={pathname.startsWith(item.href) && (item.href.length > 10 ? true : pathname === item.href)}
                  tooltip={{children: item.label}}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
