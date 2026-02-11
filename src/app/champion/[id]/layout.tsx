'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut, Star, Loader2 } from 'lucide-react';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ChampionNav } from "@/app/components/ChampionNav";
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useEffect } from 'react';

export default function ChampionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  const championId = typeof params.id === 'string' ? params.id : '';
  
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/');
    }
    // If a user is logged in but their ID doesn't match the URL, redirect them.
    if (!isUserLoading && user && user.uid !== championId) {
        router.push(`/champion/${user.uid}`);
    }
  }, [isUserLoading, user, router, championId]);
  
  // Construct the champion object from the authenticated user.
  // In a real app, this would be fetched from Firestore, but this works for now.
  const champion = user ? {
    id: user.uid,
    name: user.displayName || 'Champion',
    avatarUrl: user.photoURL || '',
    points: 125, // Mock points, as we don't have this in auth user object
  } : null;

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  // If loading, or if the user is not the champion of this page, show a loader.
  if (isUserLoading || !user || !champion || user.uid !== championId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
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
