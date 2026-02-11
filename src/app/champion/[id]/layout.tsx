'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChoreChampionLogo } from '@/app/components/ChoreChampionLogo';
import { LogOut, Star } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Toaster } from "@/components/ui/toaster";

// Mock data for champions
const championsData = [
  {
    id: "alex",
    name: "Alex",
    avatarId: 'champion-avatar-1',
    points: 125,
  },
  {
    id: "bella",
    name: "Bella",
    avatarId: 'champion-avatar-2',
    points: 85,
  },
];

export default function ChampionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const championId = typeof params.id === 'string' ? params.id : '';
  const champion = championsData.find(c => c.id === championId);
  const championAvatar = PlaceHolderImages.find(p => p.id === champion?.avatarId);

  if (!champion) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 z-10">
            <Link href="/" className="flex items-center gap-2 font-semibold">
                <ChoreChampionLogo className="h-8 w-8" />
                <span className="font-bold font-headline text-lg">Chore Champion</span>
            </Link>
            <div className="ml-auto flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Star className="w-6 h-6 text-accent fill-accent" />
                    <span className="font-bold text-xl text-foreground">{champion.points}</span>
                    <span className="text-sm text-muted-foreground">Points</span>
                </div>
                <Avatar className="h-10 w-10 border">
                    <AvatarImage src={championAvatar?.imageUrl} alt={champion.name} />
                    <AvatarFallback>{champion.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" asChild>
                    <Link href="/">
                        <LogOut className="mr-2 h-4 w-4"/>
                        Log Out
                    </Link>
                </Button>
            </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            {children}
        </main>
        <Toaster />
    </div>
  );
}
