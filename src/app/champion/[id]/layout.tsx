'use client';

import Link from 'next/link';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut, Star, Loader2 } from 'lucide-react';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ChampionNav } from "@/app/components/ChampionNav";
import { useUser, useAuth, useDoc, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useEffect, useRef } from 'react';
import { doc, collection, query, orderBy, limit } from 'firebase/firestore';
import type { Adventurer } from '@/app/dashboard/champions/page';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

export default function AdventurerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const adventurerId = typeof params.id === 'string' ? params.id : '';
  
  const adventurerDocRef = useMemoFirebase(() => {
    if (!firestore || !user || !adventurerId) return null;
    return doc(firestore, 'champions', adventurerId);
  }, [firestore, user, adventurerId]);

  const { data: realAdventurer, isLoading: isAdventurerLoading } = useDoc<Adventurer>(adventurerDocRef);

  // Real-time listener for Messages
  const messagesQuery = useMemoFirebase(() => {
    if (!firestore || !user || !realAdventurer?.parentId) return null;
    return query(
      collection(firestore, 'users', realAdventurer.parentId, 'messages'),
      orderBy('timestamp', 'desc'),
      limit(1)
    );
  }, [firestore, user, realAdventurer?.parentId]);

  const { data: latestMessages } = useCollection(messagesQuery);

  // Real-time listener for New Quests
  const questsQuery = useMemoFirebase(() => {
    if (!firestore || !user || !adventurerId) return null;
    return query(
      collection(firestore, 'champions', adventurerId, 'assignedChores'),
      orderBy('id', 'desc'),
      limit(1)
    );
  }, [firestore, user, adventurerId]);

  const { data: latestQuests } = useCollection(questsQuery);
  const lastQuestIdRef = useRef<string | null>(null);

  // Handle New Quest Notifications
  useEffect(() => {
    if (latestQuests && latestQuests.length > 0) {
      const quest = latestQuests[0];
      const newQuestEnabled = realAdventurer?.notificationPreferences?.newQuestAlerts !== false;

      if (lastQuestIdRef.current && lastQuestIdRef.current !== quest.id && newQuestEnabled) {
        toast({
          title: "New Quest Assigned!",
          description: `"${quest.choreName}" has been added to your list.`,
        });
      }
      lastQuestIdRef.current = quest.id;
    }
  }, [latestQuests, realAdventurer, toast]);

  // Handle Message Notifications
  useEffect(() => {
    if (latestMessages && latestMessages.length > 0) {
      const msg = latestMessages[0];
      const isSelf = msg.senderId === user?.uid;
      const isOnBroadcastPage = pathname === `/champion/${adventurerId}/broadcast`;
      const chatEnabled = realAdventurer?.notificationPreferences?.chatAlerts !== false;
      
      if (!isSelf && !isOnBroadcastPage && chatEnabled) {
        const lastRead = localStorage.getItem(`lastRead_broadcast_${user?.uid}`);
        const isUnseen = !lastRead || new Date(msg.timestamp).getTime() > parseInt(lastRead);

        if (isUnseen) {
          const lastNotified = sessionStorage.getItem(`lastNotified_${msg.id}`);
          if (!lastNotified) {
            toast({
              title: `New Family Message`,
              description: msg.text.length > 50 ? msg.text.substring(0, 50) + '...' : msg.text,
              action: (
                <Button size="sm" onClick={() => router.push(`/champion/${adventurerId}/broadcast`)}>View</Button>
              )
            });
            sessionStorage.setItem(`lastNotified_${msg.id}`, 'true');
          }
        }
      }
    }
  }, [latestMessages, pathname, user?.uid, toast, router, adventurerId, realAdventurer]);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/');
    }
    if (!isUserLoading && user && user.uid !== adventurerId) {
        router.push(`/champion/${user.uid}`);
    }
  }, [isUserLoading, user, router, adventurerId]);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    router.push('/');
  };

  const adventurer = realAdventurer || (user ? {
    id: user.uid,
    parentId: 'default-parent-id',
    name: 'Adventurer',
    username: 'adventurer_hero',
    email: 'adventurer@example.com',
    avatarUrl: '',
    points: 0,
  } as Adventurer : null);

  if (isUserLoading || (adventurerId && !realAdventurer && isAdventurerLoading)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!isUserLoading && user && user.uid !== adventurerId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
            <p className="text-lg font-semibold">Redirecting...</p>
        </div>
      </div>
    );
  }

  if (!user || !adventurer) {
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <div className="text-center max-w-md p-6 border rounded-lg shadow-sm bg-card">
          <h1 className="text-xl font-bold font-headline mb-2">Access Denied</h1>
          <p className="text-sm text-muted-foreground mb-6">
            You do not have permission to view this page. Please log in to continue.
          </p>
          <Button onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Return to Login
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <SidebarProvider>
        <Sidebar variant="inset" collapsible="icon">
          <ChampionNav />
        </Sidebar>
        <SidebarInset>
            <header className="flex h-16 items-center justify-end gap-4 border-b-0 backdrop-blur-sm px-4 sticky top-0 z-30 lg:px-6 bg-transparent">
                <SidebarTrigger className="md:hidden mr-auto" />
                <div className="flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-4 py-1 shadow-md">
                    <Star className="w-6 h-6 text-accent fill-accent stroke-primary-foreground" />
                    <span className="font-bold text-xl text-primary-foreground">{adventurer.points}</span>
                    <span className="text-sm text-primary-foreground">Points</span>
                </div>
                <Avatar className="h-10 w-10 border-2 border-black">
                    <AvatarImage src={adventurer.avatarUrl || undefined} alt={adventurer.name} />
                    <AvatarFallback className="bg-secondary text-secondary-foreground">{adventurer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button variant="secondary" size="sm" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4"/>
                    Log Out
                </Button>
            </header>
            <main className="flex-1 overflow-auto p-4 lg:p-6">
                {children}
            </main>
            <Toaster />
        </SidebarInset>
    </SidebarProvider>
  );
}
