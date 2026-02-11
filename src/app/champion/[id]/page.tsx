'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
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
import { Star, Trophy, CheckCircle2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from '@/lib/placeholder-images';

// MOCK DATA - in a real app, this would be fetched based on the champion's ID
const championsData = [
  { id: "alex", name: "Alex", points: 125 },
  { id: "bella", name: "Bella", points: 85 },
];

const allChores = [
    { id: 'chore-1', name: 'Water the plants', points: 5, assignedTo: 'alex', status: 'pending' },
    { id: 'chore-2', name: 'Set the dinner table', points: 3, assignedTo: 'bella', status: 'pending' },
    { id: 'chore-3', name: 'Take out the trash', points: 5, assignedTo: 'alex', status: 'completed' },
    { id: 'chore-4', name: 'Feed the pets', points: 3, assignedTo: 'alex', status: 'pending' },
];

const allRewards = [
  { id: "reward-screentime", name: "Extra Screen Time", description: "30 extra minutes of screen time.", points: 75, imageId: "reward-screentime" },
  { id: "reward-icecream", name: "Ice Cream Trip", description: "A trip to the ice cream parlor.", points: 150, imageId: "reward-icecream" },
  { id: "reward-movie", name: "Movie Night Choice", description: "You pick the movie for movie night.", points: 200, imageId: "reward-movie" },
  { id: "reward-lego", name: "New Lego Set", description: "Pick out a new Lego set (up to $25).", points: 500, imageId: "reward-lego" },
];


export default function ChampionDashboardPage() {
    const params = useParams();
    const { toast } = useToast();
    const championId = typeof params.id === 'string' ? params.id : '';
    
    const champion = championsData.find(c => c.id === championId);
    const chores = allChores.filter(c => c.assignedTo === championId);
    const rewards = allRewards;

    const handleClaimReward = (reward: typeof allRewards[0]) => {
        if (champion && champion.points >= reward.points) {
            // In a real app, you would deduct points and record the claim
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

    if (!champion) {
        return <p>Loading champion dashboard...</p>;
    }

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
                                {chores.filter(c => c.status === 'pending').length > 0 ? (
                                    chores.filter(c => c.status === 'pending').map(chore => (
                                    <TableRow key={chore.id}>
                                        <TableCell className="font-medium">{chore.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                                                <Star className="w-3 h-3 text-accent fill-accent" /> {chore.points}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm">Mark as Done</Button>
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
                                {chores.filter(c => c.status === 'completed').length > 0 ? (
                                    chores.filter(c => c.status === 'completed').map(chore => (
                                    <TableRow key={chore.id} className="text-muted-foreground">
                                        <TableCell className="font-medium">{chore.name}</TableCell>
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
                    {rewards.map((reward) => {
                        const rewardImage = PlaceHolderImages.find(p => p.id === reward.imageId);
                        const canAfford = champion.points >= reward.points;
                        return (
                            <Card key={reward.id} className="overflow-hidden flex flex-col">
                                <CardContent className="p-0">
                                    <div className="relative aspect-[4/3] bg-muted">
                                        {rewardImage?.imageUrl ? (
                                            <Image src={rewardImage.imageUrl} alt={reward.name} fill className="object-cover" data-ai-hint={rewardImage.imageHint} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-secondary">
                                                <Trophy className="w-12 h-12 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                                <div className="p-4 flex-grow flex flex-col">
                                    <CardTitle className="text-lg leading-tight">{reward.name}</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1 flex-grow">{reward.description}</p>
                                    <Badge variant="secondary" className="w-fit mt-2 text-sm">
                                        <Star className="w-3 h-3 mr-1 text-accent fill-accent" />
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
