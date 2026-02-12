'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUser, useFirestore, useAuth } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Nav } from "@/app/components/Nav";
import { UserNav } from "@/app/components/UserNav";
import { ScheduleProvider } from "@/app/context/ScheduleContext";
import { Loader2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { cn } from '@/lib/utils';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const auth = useAuth();
  const [isRoleVerified, setIsRoleVerified] = useState(false);
  
  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    router.push('/');
  };

  useEffect(() => {
    // Wait until the initial authentication check is complete.
    if (isUserLoading) {
      return;
    }

    // If the user is not logged in at all, send them to the login page.
    if (!user) {
      router.push('/');
      return;
    }

    // Use a one-time, definitive check to determine the user's role.
    // This avoids the race condition caused by real-time listeners.
    const verifyUserRole = async () => {
      const parentProfileDocRef = doc(firestore, 'users', user.uid);
      const docSnap = await getDoc(parentProfileDocRef);

      if (!docSnap.exists()) {
        // If no parent profile exists, this user is not a parent.
        // Redirect them to their champion-specific page.
        router.push(`/champion/${user.uid}`);
      } else {
        // A parent profile exists. Grant access to the dashboard.
        setIsRoleVerified(true);
      }
    };

    verifyUserRole();

  }, [isUserLoading, user, firestore, router]);

  // Show a loader until authentication is confirmed AND the user's role has been verified.
  if (isUserLoading || !isRoleVerified) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If all checks pass, render the parent dashboard layout.
  return (
    <ScheduleProvider>
      <SidebarProvider>
        <Sidebar variant="inset" collapsible="icon">
          <Nav />
        </Sidebar>
        <SidebarInset>
          <header className="flex h-16 items-center justify-end gap-4 border-b backdrop-blur-sm px-4 sticky top-0 z-30 lg:px-6">
            <SidebarTrigger className="md:hidden mr-auto" />
            <UserNav />
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </header>
          <main className="flex-1 overflow-auto p-4 lg:p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ScheduleProvider>
  );
}
