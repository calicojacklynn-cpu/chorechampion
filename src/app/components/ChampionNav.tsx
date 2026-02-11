"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  ChevronDown,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { ChoreChampionLogo } from "./ChoreChampionLogo";

export function ChampionNav() {
  const pathname = usePathname();
  const params = useParams();
  const championId = typeof params.id === 'string' ? params.id : '';
  
  const dashboardHref = `/champion/${championId}`;
  const settingsHref = `/champion/${championId}/settings`;
  const notificationsHref = `/champion/${championId}/settings/notifications`;

  const settingsChildren = [
      { href: settingsHref, label: "Account" },
      { href: notificationsHref, label: "Notifications" },
  ];

  return (
    <>
      <SidebarHeader className="group-data-[collapsible=icon]:justify-center">
        <Link href={dashboardHref} className="flex items-center gap-2">
          <ChoreChampionLogo className="h-8 w-8" />
          <span className="font-bold font-headline text-lg group-data-[collapsible=icon]:hidden">
            Chore Champion
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={pathname === dashboardHref}
              tooltip={{ children: "Dashboard" }}
              asChild
            >
              <Link href={dashboardHref}>
                <LayoutDashboard />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <Collapsible
            asChild
            defaultOpen={pathname.startsWith(settingsHref)}
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  isActive={pathname.startsWith(settingsHref) && !settingsChildren.some(c => c.href === pathname)}
                  tooltip={{ children: "Settings" }}
                  className="w-full justify-start group"
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings />
                      <span>Settings</span>
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </div>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {settingsChildren.map((child) => (
                    <SidebarMenuSubItem key={child.href}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={pathname === child.href}
                      >
                        <Link href={child.href}>{child.label}</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
