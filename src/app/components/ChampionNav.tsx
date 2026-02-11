"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  LayoutDashboard,
} from "lucide-react";

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
} from "@/components/ui/sidebar";
import { ChoreChampionLogo } from "./ChoreChampionLogo";

export function ChampionNav() {
  const pathname = usePathname();
  const params = useParams();
  const championId = typeof params.id === 'string' ? params.id : '';

  const navItems = [
    { href: `/champion/${championId}`, icon: LayoutDashboard, label: "My Dashboard" },
  ];

  return (
    <>
      <SidebarHeader className="group-data-[collapsible=icon]:justify-center">
        <Link href={`/champion/${championId}`} className="flex items-center gap-2">
          <ChoreChampionLogo className="h-8 w-8" />
          <span className="font-bold font-headline text-lg group-data-[collapsible=icon]:hidden">
            Chore Champion
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) =>
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
