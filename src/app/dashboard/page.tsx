
'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, collectionGroup } from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ListTodo, Star, Loader2 } from "lucide-react";
import type { Champion } from './champions/page';

type AssignedChore = {
    id: string;
    championId: string;
    choreName: string;
    completed: boolean;
};

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  // Fetch champions
  const championsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'champions'), where('parentId', '==', user.uid));
  }, [firestore, user]);
  const { data: champions, isLoading: isChampionsLoading } = useCollection<Champion>(championsQuery);

  // Note: To fetch ALL assigned chores across all champions efficiently, we'd use a collectionGroup
  // but rules and indexes need to be configured. For MVP, we'll show standing.
  
  if (isChampionsLoading) return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Good Morning, {user?.displayName || 'Parent'}!
        </h1>
        <p className="text-muted-foreground">
          Here's a quick look at your family's progress.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-accent fill-accent stroke-black" />
              Champion Standings
            </CardTitle>
            <CardDescription>
              Current points for each champion.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Champion</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {champions && champions.length > 0 ? (
                    champions.map(champion => (
                        <TableRow key={champion.id}>
                            <TableCell className="font-medium">{champion.name}</TableCell>
                            <TableCell className="text-right font-bold">{champion.points}</TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                            No champions found.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListTodo className="h-5 w-5 text-muted-foreground" />
              Activity Feed
            </CardTitle>
            <CardDescription>
              Recent updates from your champions.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="h-24 flex items-center justify-center text-muted-foreground text-sm">
                Activity feed will appear as quests are completed.
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
