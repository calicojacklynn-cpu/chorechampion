import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Nav } from "@/app/components/Nav";
import { UserNav } from "@/app/components/UserNav";
import type { Metadata } from "next";
import { ScheduleProvider } from "@/app/context/ScheduleContext";

export const metadata: Metadata = {
  title: 'Chore Champion Dashboard',
  description: 'Your family chore management center.',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
