'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
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
import { ListTodo, Star, Loader2, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from 'react';
import type { Champion } from './champions/page';

type FeedItem = {
    id: string;
    championName: string;
    choreName: string;
    date: string;
};

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [isFeedLoading, setIsFeedLoading] = useState(true);

  // Fetch champions
  const championsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'champions'), where('parentId', '==', user.uid));
  }, [firestore, user?.uid]);
  
  const { data: champions, isLoading: isChampionsLoading } = useCollection<Champion>(championsQuery);

  // Fetch recent completed chores from all champions
  useEffect(() => {
    if (!champions || champions.length === 0 || !firestore) {
        setIsFeedLoading(false);
        return;
    }

    const fetchFeed = async () => {
        setIsFeedLoading(true);
        try {
            const allCompleted: FeedItem[] = [];
            for (const champion of champions) {
                const q = query(
                    collection(firestore, 'champions', champion.id, 'assignedChores'),
                    where('completed', '==', true),
                    orderBy('dueDate', 'desc'),
                    limit(5)
                );
                const snap = await getDocs(q);
                snap.forEach(doc => {
                    const data = doc.data();
                    allCompleted.push({
                        id: doc.id,
                        championName: champion.name,
                        choreName: data.choreName,
                        date: data.dueDate
                    });
                });
            }
            setFeed(allCompleted.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10));
        } catch (e) {
            console.error("Feed error:", e);
        } finally {
            setIsFeedLoading(false);
        }
    };

    fetchFeed();
  }, [champions, firestore]);

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
             {isFeedLoading ? (
                 <div className="flex justify-center p-8">
                     <Loader2 className="h-6 w-6 animate-spin" />
                 </div>
             ) : feed.length > 0 ? (
                 <div className="space-y-4">
                     {feed.map(item => (
                         <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                             <CheckCircle2 className="h-5 w-5 text-green-500" />
                             <div>
                                 <p className="text-sm font-medium">
                                     <span className="font-bold">{item.championName}</span> finished <span className="italic">"{item.choreName}"</span>
                                 </p>
                                 <p className="text-xs text-muted-foreground">
                                     {new Date(item.date).toLocaleDateString()}
                                 </p>
                             </div>
                         </div>
                     ))}
                 </div>
             ) : (
                 <div className="h-24 flex items-center justify-center text-muted-foreground text-sm">
                    No recent activity. Assign some quests to get started!
                 </div>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
