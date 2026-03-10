"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { QuestKindLogo } from "./QuestKindLogo";
import { useFirestore, useUser, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/chores", icon: ListTodo, label: "Quests" },
  { href: "/dashboard/rewards", icon: Gift, label: "Rewards" },
  { href: "/dashboard/calendar", icon: Calendar, label: "Calendar" },
  { href: "/dashboard/broadcast", icon: Megaphone, label: "Broadcasts" },
  {
    href: "/dashboard/settings",
    icon: Settings,
    label: "Settings",
    children: [
      { href: "/dashboard/settings", label: "Account" },
      { href: "/dashboard/settings/notifications", label: "Notifications" },
      { href: "/dashboard/settings/family", label: "Family" },
      { href: "/dashboard/settings/subscription", label: "Subscription" },
      { href: "/dashboard/settings/themes", label: "Themes" },
    ],
  },
];

export function Nav() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const { user } = useUser();
  const firestore = useFirestore();
  const [hasUnread, setHasUnread] = useState(false);

  const messagesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'users', user.uid, 'messages'),
      orderBy('timestamp', 'desc'),
      limit(1)
    );
  }, [firestore, user]);

  const { data: latestMessages } = useCollection(messagesQuery);

  useEffect(() => {
    if (latestMessages && latestMessages.length > 0) {
      const latestMsg = latestMessages[0];
      const lastRead = localStorage.getItem(`lastRead_broadcast_${user?.uid}`);
      
      if (!lastRead || new Date(latestMsg.timestamp).getTime() > parseInt(lastRead)) {
        if (pathname !== '/dashboard/broadcast' && latestMsg.senderId !== user?.uid) {
          setHasUnread(true);
        }
      } else {
        setHasUnread(false);
      }
    }
  }, [latestMessages, pathname, user?.uid]);

  const handleLinkClick = () => {
    setOpenMobile(false);
  };

  return (
    <>
      <SidebarHeader className="group-data-[collapsible=icon]:justify-center">
        <Link href="/dashboard" className="flex items-center gap-2" onClick={handleLinkClick}>
          <QuestKindLogo className="h-8 w-8" />
          <span className="font-bold font-headline text-lg group-data-[collapsible=icon]:hidden text-sidebar-foreground">
            QuestKind
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => {
            const isBroadcast = item.href === "/dashboard/broadcast";
            return item.children ? (
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
                            <Link href={child.href} onClick={handleLinkClick}>{child.label}</Link>
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
                  <Link href={item.href} onClick={handleLinkClick} className="relative">
                    <item.icon />
                    <span>{item.label}</span>
                    {isBroadcast && hasUnread && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
