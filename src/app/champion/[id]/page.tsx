
'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useUser, useDoc, useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { doc, collection, query } from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, CheckCircle2, Loader2, Gift } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { Adventurer } from '@/app/dashboard/champions/page';
import type { Reward } from '@/app/dashboard/rewards/page';

type AssignedChore = {
    id: string;
    choreName: string;
    pointsValue: number;
    completed: boolean;
};

export default function AdventurerDashboardPage() {
    const { toast } = useToast();
    const firestore = useFirestore();
    const { user } = useUser();
    const params = useParams();
    const adventurerId = typeof params.id === 'string' ? params.id : '';

    const adventurerDocRef = useMemoFirebase(() => {
      if (!firestore || !user || !adventurerId) return null;
      return doc(firestore, 'champions', adventurerId);
    }, [firestore, user, adventurerId]);
    const { data: adventurer, isLoading: isAdventurerLoading } = useDoc<Adventurer>(adventurerDocRef);

    const choresQuery = useMemoFirebase(() => {
      if (!firestore || !user || !adventurerId) return null;
      return collection(firestore, 'champions', adventurerId, 'assignedChores');
    }, [firestore, user, adventurerId]);
    const { data: assignedChores, isLoading: areChoresLoading } = useCollection<AssignedChore>(choresQuery);
    
    const rewardsQuery = useMemoFirebase(() => {
        const parentId = adventurer?.parentId;
        if (!parentId || !firestore || !user) return null;
        return collection(firestore, 'users', parentId, 'rewards');
    }, [firestore, user, adventurer?.parentId]);
    const { data: rewards, isLoading: areRewardsLoading } = useCollection<Reward>(rewardsQuery);
    
    const handleClaimReward = (reward: Reward) => {
        if (adventurer && adventurer.points >= reward.points) {
            const colRef = collection(firestore, 'champions', adventurer.id, 'redeemedRewards');
            addDocumentNonBlocking(colRef, {
                rewardId: reward.id,
                rewardName: reward.name,
                pointsCost: reward.points,
                redemptionDate: new Date().toISOString(),
                status: 'pending'
            });
            
            toast({
                title: "Reward Claimed!",
                description: `You've submitted a claim for "${reward.name}".`,
            });
        } else {
             toast({
                variant: "destructive",
                title: "Not enough points!",
                description: `You need more points to claim this.`,
            });
        }
    };
    
    const handleMarkAsDone = (choreId: string) => {
        if (!firestore || !adventurerId) return;
        const docRef = doc(firestore, 'champions', adventurerId, 'assignedChores', choreId);
        updateDocumentNonBlocking(docRef, { completed: true });
        toast({
            title: "Quest Submitted!",
            description: "Great job! Your parent has been notified.",
        });
    }

    if (isAdventurerLoading || areChoresLoading || areRewardsLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    if (!adventurer) return <div className="p-8 text-center">Adventurer profile not found.</div>;

    const pendingChores = assignedChores?.filter(c => !c.completed) || [];
    const completedChores = assignedChores?.filter(c => c.completed) || [];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">
                    Welcome back, {adventurer.name}!
                </h1>
                <p className="text-muted-foreground">
                    Here are your current quests and rewards. Keep up the great work!
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Active Quests</CardTitle>
                        <CardDescription>Complete these to earn points.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Quest</TableHead>
                                    <TableHead>Points</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pendingChores.length > 0 ? (
                                    pendingChores.map(chore => (
                                    <TableRow key={chore.id}>
                                        <TableCell className="font-medium">{chore.choreName}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                                                <Star className="w-3 h-3 text-accent fill-accent stroke-black" /> {chore.pointsValue}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" onClick={() => handleMarkAsDone(chore.id)}>Submit Quest</Button>
                                        </TableCell>
                                    </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                            No active quests.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>Finished Quests</CardTitle>
                        <CardDescription>Waiting for parent approval.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Quest</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {completedChores.length > 0 ? (
                                    completedChores.map(chore => (
                                    <TableRow key={chore.id} className="text-muted-foreground">
                                        <TableCell className="font-medium">{chore.choreName}</TableCell>
                                        <TableCell className="text-right flex items-center justify-end gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            Pending
                                        </TableCell>
                                    </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                                            No quests submitted yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold tracking-tight font-headline">Reward Catalog</h2>
                </div>
                 <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {rewards && rewards.map((reward) => {
                        const canAfford = adventurer.points >= reward.points;
                        return (
                            <Card key={reward.id} className="overflow-hidden flex flex-col">
                                <CardContent className="p-0">
                                    <div className="relative aspect-[4/3] bg-muted">
                                        {reward.imageUrl ? (
                                            <Image src={reward.imageUrl} alt={reward.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-secondary">
                                                <Gift className="w-12 h-12 opacity-20" />
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                                <div className="p-4 flex-grow flex flex-col">
                                    <CardTitle className="text-lg leading-tight">{reward.name}</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1 flex-grow">{reward.description}</p>
                                    <Badge variant="secondary" className="w-fit mt-2 text-sm">
                                        <Star className="w-3 h-3 mr-1 text-accent fill-accent stroke-black" />
                                        {reward.points} Points
                                    </Badge>
                                </div>
                                <CardFooter className="p-4 pt-0">
                                    <Button className="w-full" disabled={!canAfford} onClick={() => handleClaimReward(reward)}>
                                        {canAfford ? 'Claim Reward' : 'Need More Points'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            </section>
        </div>
    );
}
