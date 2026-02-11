'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '@/firebase';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Nav } from "@/app/components/Nav";
import { UserNav } from "@/app/components/UserNav";
import { ScheduleProvider } from "@/app/context/ScheduleContext";
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/');
    }
  }, [isUserLoading, user, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <ScheduleProvider>
      <SidebarProvider>
        <Sidebar variant="inset" collapsible="icon">
          <Nav />
        </Sidebar>
        <SidebarInset>
          <header className="flex h-16 items-center justify-end border-b bg-card px-4 sticky top-0 z-30 lg:px-6">
            <SidebarTrigger className="md:hidden mr-auto" />
            <UserNav />
          </header>
          <main className="flex-1 overflow-auto p-4 lg:p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ScheduleProvider>
  );
}
