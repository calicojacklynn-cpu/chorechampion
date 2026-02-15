"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  LayoutDashboard,
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
  useSidebar,
} from "@/components/ui/sidebar";
import { ChoreChampionLogo } from "./ChoreChampionLogo";

export function ChampionNav() {
  const pathname = usePathname();
  const params = useParams();
  const { setOpenMobile } = useSidebar();
  const championId = typeof params.id === 'string' ? params.id : '';
  
  const dashboardHref = `/champion/${championId}`;
  const broadcastHref = `/champion/${championId}/broadcast`;
  const settingsBaseHref = `/champion/${championId}/settings`;

  const settingsChildren = [
      { href: `${settingsBaseHref}`, label: "Account" },
      { href: `${settingsBaseHref}/notifications`, label: "Notifications" },
  ];

  const handleLinkClick = () => {
    setOpenMobile(false);
  };

  return (
    <>
      <SidebarHeader className="group-data-[collapsible=icon]:justify-center">
        <Link href={dashboardHref} className="flex items-center gap-2" onClick={handleLinkClick}>
          <ChoreChampionLogo className="h-8 w-8" />
          <span className="font-bold font-headline text-lg group-data-[collapsible=icon]:hidden text-sidebar-foreground">
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
              <Link href={dashboardHref} onClick={handleLinkClick}>
                <LayoutDashboard />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={pathname === broadcastHref}
              tooltip={{ children: "Broadcasts" }}
              asChild
            >
              <Link href={broadcastHref} onClick={handleLinkClick}>
                <Megaphone />
                <span>Broadcasts</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <Collapsible
            asChild
            defaultOpen={pathname.startsWith(settingsBaseHref)}
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  isActive={pathname.startsWith(settingsBaseHref) && !settingsChildren.some(c => c.href === pathname)}
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
                        <Link href={child.href} onClick={handleLinkClick}>{child.label}</Link>
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
