
'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useUser, useDoc, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
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
import { Star, CheckCircle2, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Champion } from '@/app/dashboard/champions/page';
import type { Reward } from '@/app/dashboard/rewards/page';
import type { AssignedChore } from '@/ai';
import { TrophyIcon } from '@/components/TrophyIcon';

export default function ChampionDashboardPage() {
    const { toast } = useToast();
    const firestore = useFirestore();
    const { user } = useUser();
    const params = useParams();
    const championId = typeof params.id === 'string' ? params.id : '';

    // Fetch champion profile
    const championDocRef = useMemoFirebase(() => {
      if (!firestore || !user) return null;
      return doc(firestore, 'champions', championId);
    }, [firestore, user, championId]);
    const { data: realChampion, isLoading: isChampionLoading } = useDoc<Champion>(championDocRef);

    // For development, provide a default profile to view the UI.
    const champion = realChampion || {
        id: championId,
        parentId: 'default-parent-id',
        name: 'Alex',
        username: 'alex_the_great',
        email: 'alex@example.com',
        avatarUrl: '',
        points: 125,
    } as Champion;

    // Fetch assigned chores for this champion
    const choresQuery = useMemoFirebase(() => {
      if (!firestore || !user) return null;
      return collection(firestore, 'champions', championId, 'assignedChores');
    }, [firestore, user, championId]);
    const { data: assignedChores, isLoading: areChoresLoading } = useCollection<AssignedChore>(choresQuery);
    
    // Fetch parent's rewards catalog
    const rewardsQuery = useMemoFirebase(() => {
        // Only attempt to fetch rewards if we have a real champion profile from Firestore.
        // The fallback profile has a placeholder parentId which will cause a permission error.
        if (!realChampion?.parentId) return null;
        return collection(firestore, 'users', realChampion.parentId, 'rewards');
    }, [firestore, realChampion]);
    const { data: rewards, isLoading: areRewardsLoading } = useCollection<Reward>(rewardsQuery);
    
    const handleClaimReward = (reward: Reward) => {
        if (champion && champion.points >= reward.points) {
            // In a real app, this would deduct points and record the claim in Firestore
            // e.g., create a document in /champions/{championId}/redeemedRewards
            toast({
                title: "Reward Claimed!",
                description: `You've successfully claimed "${reward.name}". Your parent has been notified.`,
            });
        } else {
             toast({
                variant: "destructive",
                title: "Not enough points!",
                description: `You need ${reward.points - (champion?.points || 0)} more points to claim this reward.`,
            });
        }
    };
    
    const handleMarkAsDone = (choreId: string) => {
        // In a real app, this would update the 'completed' status of the chore in Firestore.
        toast({
            title: "Quest Submitted!",
            description: "Your parent has been notified for approval.",
        });
    }

    if ((isChampionLoading && !realChampion) || areChoresLoading || areRewardsLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    const pendingChores = assignedChores?.filter(c => !c.completed) || [];
    const completedChores = assignedChores?.filter(c => c.completed) || [];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">
                    Welcome back, {champion.name}!
                </h1>
                <p className="text-muted-foreground">
                    Here are your quests and rewards. Keep up the great work!
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Today's Quests</CardTitle>
                        <CardDescription>Chores you need to complete.</CardDescription>
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
                                            <Button variant="outline" size="sm" onClick={() => handleMarkAsDone(chore.id)}>Mark as Done</Button>
                                        </TableCell>
                                    </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-24 text-center">
                                            No quests for today. Great job!
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>Completed Quests</CardTitle>
                        <CardDescription>Quests you've already finished.</CardDescription>
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
                                            Done
                                        </TableCell>
                                    </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2} className="h-24 text-center">
                                            No quests completed yet.
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
                        const rewardImage = PlaceHolderImages.find(p => p.id === reward.id);
                        const imageUrl = reward.imageUrl || rewardImage?.imageUrl;
                        const canAfford = champion.points >= reward.points;
                        return (
                            <Card key={reward.id} className="overflow-hidden flex flex-col">
                                <CardContent className="p-0">
                                    <div className="relative aspect-[4/3] bg-muted">
                                        {imageUrl ? (
                                            <Image src={imageUrl} alt={reward.name} fill className="object-cover" data-ai-hint={reward.imageHint} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-secondary">
                                                <TrophyIcon className="w-12 h-12 text-accent" />
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
                                        {canAfford ? 'Claim Reward' : 'Not Enough Points'}
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
