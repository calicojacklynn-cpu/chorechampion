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
import { useTheme } from '@/app/context/ThemeContext';
import { themes } from '@/lib/themes';


// Based on ParentProfile in backend.json
export type UserProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const { theme } = useTheme();

  const currentTheme = themes.find((t) => t.className === theme);
  const bodyStyle = currentTheme ? { backgroundImage: currentTheme.gradient } : {};

  // Check if the currently logged-in user has a profile in the 'users' (parent) collection.
  const parentProfileDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: parentProfile, isLoading: isParentLoading } = useDoc<UserProfile>(parentProfileDocRef);

  useEffect(() => {
    // If user is loaded and not logged in, redirect to home.
    if (!isUserLoading && !user) {
      router.push('/');
      return;
    }
    
    // If user and parent profile check are loaded, decide where to route.
    if (!isUserLoading && !isParentLoading && user) {
        // If a parent profile does NOT exist for this user, they must be a champion.
        // Redirect them to their dedicated champion dashboard.
        if (!parentProfile) {
            router.push(`/champion/${user.uid}`);
        }
        // If a parent profile *does* exist, they are a parent and can stay on the dashboard.
    }
  }, [isUserLoading, isParentLoading, user, parentProfile, router]);

  // Show a loader while we determine auth state and user role.
  // Also keep showing loader if we have determined the user is a champion and are about to redirect.
  if (isUserLoading || isParentLoading || (user && !parentProfile)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If we've passed the checks above, it means the user is loaded,
  // is a parent (has a profile), so render the parent dashboard.
  if (user && parentProfile) {
      return (
        <div style={bodyStyle}>
          <ScheduleProvider>
            <SidebarProvider>
              <Sidebar variant="inset" collapsible="icon">
                <Nav />
              </Sidebar>
              <SidebarInset>
                <header className="flex h-16 items-center justify-end border-b bg-background/80 backdrop-blur-sm px-4 sticky top-0 z-30 lg:px-6">
                  <SidebarTrigger className="md:hidden mr-auto" />
                  <UserNav />
                </header>
                <main className="flex-1 overflow-auto p-4 lg:p-6">
                  {children}
                </main>
              </SidebarInset>
            </SidebarProvider>
          </ScheduleProvider>
        </div>
      );
  }

  // This is a fallback loader for any edge cases (like during logout).
  return (
    <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}
