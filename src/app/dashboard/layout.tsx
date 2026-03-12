'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUser, useFirestore, useAuth, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { doc, getDoc, collection, query, orderBy, limit } from 'firebase/firestore';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Nav } from "@/app/components/Nav";
import { UserNav } from "@/app/components/UserNav";
import { ScheduleProvider } from "@/app/context/ScheduleContext";
import { Loader2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const firestore = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();
  const [isRoleVerified, setIsRoleVerified] = useState(false);
  
  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    router.push('/');
  };

  // Fetch parent profile for notification settings
  const parentDocRef = useMemoFirebase(() => {
    if (!firestore || !user || !isRoleVerified) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user, isRoleVerified]);
  const { data: parentProfile } = useDoc(parentDocRef);

  // Real-time listener for "Push Notification" (Toast)
  const messagesQuery = useMemoFirebase(() => {
    if (!firestore || !user || !isRoleVerified) return null;
    return query(
      collection(firestore, 'users', user.uid, 'messages'),
      orderBy('timestamp', 'desc'),
      limit(1)
    );
  }, [firestore, user, isRoleVerified]);

  const { data: latestMessages } = useCollection(messagesQuery);

  useEffect(() => {
    if (latestMessages && latestMessages.length > 0) {
      const msg = latestMessages[0];
      const isSelf = msg.senderId === user?.uid;
      const isOnBroadcastPage = pathname === '/dashboard/broadcast';
      
      // Check notification preference
      const chatEnabled = parentProfile?.notificationPreferences?.chatAlerts !== false; // Default to true

      if (!isSelf && !isOnBroadcastPage && chatEnabled) {
        const lastRead = localStorage.getItem(`lastRead_broadcast_${user?.uid}`);
        const isUnseen = !lastRead || new Date(msg.timestamp).getTime() > parseInt(lastRead);
        
        if (isUnseen) {
          const lastNotified = sessionStorage.getItem(`lastNotified_${msg.id}`);
          if (!lastNotified) {
            toast({
              title: `New Message from ${msg.senderName}`,
              description: msg.text.length > 50 ? msg.text.substring(0, 50) + '...' : msg.text,
              action: (
                <Button size="sm" onClick={() => router.push('/dashboard/broadcast')}>View</Button>
              )
            });
            sessionStorage.setItem(`lastNotified_${msg.id}`, 'true');
          }
        }
      }
    }
  }, [latestMessages, pathname, user?.uid, toast, router, parentProfile]);

  useEffect(() => {
    if (isUserLoading) return;
    if (!user) {
      router.push('/');
      return;
    }

    const verifyUserRole = async () => {
      const parentProfileDocRef = doc(firestore, 'users', user.uid);
      const docSnap = await getDoc(parentProfileDocRef);

      if (!docSnap.exists()) {
        router.push(`/champion/${user.uid}`);
      } else {
        setIsRoleVerified(true);
      }
    };

    verifyUserRole();
  }, [isUserLoading, user, firestore, router]);

  if (isUserLoading || !isRoleVerified) {
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
          <header className="flex h-16 items-center justify-end gap-4 border-b backdrop-blur-sm px-4 sticky top-0 z-30 lg:px-6">
            <SidebarTrigger className="md:hidden mr-auto" />
            <UserNav />
            <Button variant="default" size="sm" onClick={handleLogout}>
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
