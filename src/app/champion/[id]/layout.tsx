'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut, Star, Loader2 } from 'lucide-react';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ChampionNav } from "@/app/components/ChampionNav";
import { useUser, useAuth, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useEffect } from 'react';
import { doc } from 'firebase/firestore';
import type { Champion } from '@/app/dashboard/champions/page';

export default function ChampionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const championId = typeof params.id === 'string' ? params.id : '';
  
  // Create a memoized reference to the champion document
  const championDocRef = useMemoFirebase(() => {
    if (!firestore || !championId) return null;
    return doc(firestore, 'champions', championId);
  }, [firestore, championId]);

  // Fetch the champion profile from Firestore
  const { data: champion, isLoading: isChampionLoading } = useDoc<Champion>(championDocRef);

  useEffect(() => {
    // If auth is done loading and there's no user, go to login page
    if (!isUserLoading && !user) {
      router.push('/');
    }
    // If a user is logged in but their ID doesn't match the URL, redirect them to their own page.
    if (!isUserLoading && user && user.uid !== championId) {
        router.push(`/champion/${user.uid}`);
    }
  }, [isUserLoading, user, router, championId]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  // Show a loader while auth state is resolving or champion data is being fetched
  if (isUserLoading || isChampionLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If there is no authenticated user, or the champion document doesn't exist,
  // or the logged-in user doesn't match the page, show a loader/error state.
  if (!user || !champion || user.uid !== championId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
            <p className="text-lg font-semibold">Loading Champion...</p>
            <p className="text-sm text-muted-foreground">Or you may not have permission to view this page.</p>
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
            <header className="flex h-16 items-center gap-4 border-b bg-card px-4 sticky top-0 z-30 lg:px-6">
                <SidebarTrigger className="md:hidden mr-auto" />
                <div className="flex items-center gap-2">
                    <Star className="w-6 h-6 text-accent fill-accent" />
                    <span className="font-bold text-xl text-foreground">{champion.points}</span>
                    <span className="text-sm text-muted-foreground">Points</span>
                </div>
                <Avatar className="h-10 w-10 border">
                    <AvatarImage src={champion.avatarUrl || undefined} alt={champion.name} />
                    <AvatarFallback>{champion.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" onClick={handleLogout}>
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
