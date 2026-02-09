import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const rewardsData = [
    { id: 'reward-movie', title: 'Movie Night', points: '500', description: 'Pick the movie for family night.' },
    { id: 'reward-icecream', title: 'Ice Cream Trip', points: '300', description: 'A special trip to your favorite ice cream shop.' },
    { id: 'reward-lego', title: 'New Toy Set', points: '1500', description: 'Choose a new toy set (up to $25).' },
    { id: 'reward-screentime', title: 'Extra Screen Time', points: '200', description: '30 extra minutes of screen time.' },
];

export default function RewardsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline">Rewards</h1>
                    <p className="text-muted-foreground">Motivate your champions with exciting rewards.</p>
                </div>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Reward
                </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {rewardsData.map(reward => {
                    const rewardImage = PlaceHolderImages.find(p => p.id === reward.id);
                    return (
                        <Card key={reward.id} className="overflow-hidden flex flex-col">
                            <div className="relative h-48 w-full">
                                {rewardImage && <Image src={rewardImage.imageUrl} alt={rewardImage.description} fill className="object-cover" data-ai-hint={rewardImage.imageHint} />}
                            </div>
                            <CardHeader>
                                <CardTitle>{reward.title}</CardTitle>
                                <CardDescription className="font-bold text-accent">{reward.points} Points</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-sm text-muted-foreground">{reward.description}</p>
                            </CardContent>
                            <CardFooter>
                                <Button variant="secondary" className="w-full">Edit Reward</Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
        </div>
    );
}
