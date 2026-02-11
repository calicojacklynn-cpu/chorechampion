"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ListTodo,
  Gift,
  Calendar,
  Settings,
  ChevronDown,
  Megaphone,
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

  const navItems = [
    { href: `/champion/${championId}`, icon: LayoutDashboard, label: "Dashboard" },
    { href: `/champion/${championId}/chores`, icon: ListTodo, label: "Chores" },
    { href: `/champion/${championId}/rewards`, icon: Gift, label: "Rewards" },
    { href: `/champion/${championId}/calendar`, icon: Calendar, label: "Calendar" },
    { href: `/champion/${championId}/broadcast`, icon: Megaphone, label: "Broadcasts" },
    {
      href: `/champion/${championId}/settings`,
      icon: Settings,
      label: "Settings",
      children: [
        { href: `/champion/${championId}/settings`, label: "Account" },
        { href: `/champion/${championId}/settings/notifications`, label: "Notifications" },
        { href: `/champion/${championId}/settings/family`, label: "Family" },
        { href: `/champion/${championId}/settings/subscription`, label: "Subscription" },
        { href: `/champion/${championId}/settings/localization`, label: "Localization" },
        { href: `/champion/${championId}/settings/themes`, label: "Themes" },
      ],
    },
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
            item.children ? (
              <Collapsible
                key={item.href}
                asChild
                defaultOpen={pathname.startsWith(item.href)}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={pathname.startsWith(item.href) && !item.children.some(c => c.href === pathname)}
                      tooltip={{ children: item.label }}
                      className="w-full justify-start group"
                    >
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <item.icon />
                          <span>{item.label}</span>
                        </div>
                        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.children.map((child) => (
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
            ) : (
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
            )
          )}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
