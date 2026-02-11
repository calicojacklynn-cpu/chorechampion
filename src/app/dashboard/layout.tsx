'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Nav } from "@/app/components/Nav";
import { UserNav } from "@/app/components/UserNav";
import { ScheduleProvider } from "@/app/context/ScheduleContext";
import { Loader2 } from 'lucide-react';
import type { Champion } from './champions/page';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  // Check if the currently logged-in user has a profile in the 'champions' collection.
  const championDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'champions', user.uid);
  }, [firestore, user]);

  const { data: champion, isLoading: isChampionLoading } = useDoc<Champion>(championDocRef);

  useEffect(() => {
    // If user is loaded and not logged in, redirect to home.
    if (!isUserLoading && !user) {
      router.push('/');
      return;
    }
    
    // If user and champion profile are loaded, check if they are a champion.
    if (!isUserLoading && !isChampionLoading && user) {
        // If a champion document exists, it means this user is a champion.
        // Redirect them to their dedicated champion dashboard.
        if (champion) {
            router.push(`/champion/${user.uid}`);
        }
        // If no champion document exists, they are a parent and can stay here.
    }
  }, [isUserLoading, isChampionLoading, user, champion, router]);

  // Show a loader while we determine auth state and user role.
  // Also keep showing loader if we have determined the user is a champion,
  // to avoid a flash of the parent dashboard before redirecting.
  if (isUserLoading || isChampionLoading || (user && champion)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If we've passed the checks above, it means the user is loaded,
  // is NOT a champion, so they must be a parent. Render the parent dashboard.
  if (user && !champion) {
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

  // This is a fallback loader for any edge cases (like during logout).
  return (
    <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}
