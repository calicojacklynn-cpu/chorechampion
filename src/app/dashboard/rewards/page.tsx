"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Star, Trophy } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { AddRewardDialog } from "./AddRewardDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { EditRewardDialog } from "./EditRewardDialog";

// Mock data for champions
const champions = [
  {
    id: "alex",
    name: "Alex",
    avatarId: "champion-alex",
    points: 125,
    pointsToNextReward: 200,
  },
  // Add more champions here as needed
];

// Mock data for rewards
const initialRewards = [
  {
    id: "reward-screentime",
    name: "Extra Screen Time",
    description: "30 extra minutes of screen time on a device of your choice.",
    points: 75,
  },
  {
    id: "reward-icecream",
    name: "Ice Cream Trip",
    description: "A family trip to the local ice cream parlor.",
    points: 150,
  },
  {
    id: "reward-movie",
    name: "Movie Night Choice",
    description: "You get to pick the movie for family movie night.",
    points: 200,
  },
  {
    id: "reward-lego",
    name: "New Lego Set",
    description: "Pick out a new Lego set (up to a $25 value).",
    points: 500,
  },
];

export type Reward = (typeof initialRewards)[0];

export default function RewardsPage() {
  const { toast } = useToast();
  const [rewards, setRewards] = useState(initialRewards);
  const [rewardToEdit, setRewardToEdit] = useState<Reward | null>(null);
  const [rewardToDelete, setRewardToDelete] = useState<Reward | null>(null);

  const handleAddReward = (newRewardData: Omit<Reward, "id">) => {
    const newReward: Reward = {
      ...newRewardData,
      id: `new-reward-${Date.now()}`,
      description: newRewardData.description || ""
    };
    setRewards([newReward, ...rewards]);
  };

  const handleUpdateReward = (updatedReward: Reward) => {
    setRewards(rewards.map(r => r.id === updatedReward.id ? updatedReward : r));
    toast({
      title: "Reward Updated!",
      description: `${updatedReward.name} has been updated.`,
    });
    setRewardToEdit(null);
  };

  const handleDeleteReward = (rewardId: string) => {
    const rewardName = rewards.find(r => r.id === rewardId)?.name;
    setRewards(rewards.filter(r => r.id !== rewardId));
    toast({
      title: "Reward Deleted",
      description: `${rewardName} has been removed from the catalog.`,
    });
    setRewardToDelete(null);
  };

  return (
    <>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
              <Trophy className="h-8 w-8 text-accent"/>
              Rewards & Recognition
          </h1>
          <p className="text-muted-foreground">
            Motivate your champions by rewarding their hard work with points.
          </p>
        </div>

        {/* Champion Standings Section */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight font-headline mb-4">Champion Standings</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {champions.length > 0 ? (
              champions.map((champion) => {
                const championAvatar = PlaceHolderImages.find(p => p.id === champion.avatarId);
                const progress = (champion.points / champion.pointsToNextReward) * 100;
                return (
                  <Card key={champion.id} className="flex flex-col">
                    <CardHeader className="flex flex-row items-center gap-4">
                      <Avatar className="h-16 w-16 border-2 border-primary">
                        {championAvatar && <AvatarImage asChild src={championAvatar.imageUrl}><Image src={championAvatar.imageUrl} width={64} height={64} alt={champion.name} data-ai-hint={championAvatar.imageHint} /></AvatarImage>}
                        <AvatarFallback className="text-xl">{champion.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{champion.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-accent fill-accent" />
                          <span className="font-bold text-lg text-foreground">{champion.points}</span> Points
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="text-sm text-muted-foreground mb-2">
                          Progress to next reward:
                      </div>
                      <Progress value={progress} className="h-2" />
                      <p className="text-xs text-right mt-1 text-muted-foreground">{champion.points} / {champion.pointsToNextReward} pts</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">View Claimed Rewards</Button>
                    </CardFooter>
                  </Card>
                );
              })
            ) : (
              <Card className="md:col-span-2 lg:col-span-3">
                  <CardContent className="flex items-center justify-center h-32">
                      <p className="text-muted-foreground">No champions added yet. Add a champion to start tracking points.</p>
                  </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Reward Catalog Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold tracking-tight font-headline">Reward Catalog</h2>
              <AddRewardDialog onAdd={handleAddReward} />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {rewards.length > 0 ? (
              rewards.map((reward) => {
                const rewardImage = PlaceHolderImages.find(p => p.id === reward.id);
                return (
                  <Card key={reward.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative aspect-[4/3] bg-muted">
                          {rewardImage ? (
                            <Image src={rewardImage.imageUrl} alt={reward.name} fill className="object-cover" data-ai-hint={rewardImage.imageHint} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-secondary">
                                <Trophy className="w-12 h-12 text-muted-foreground" />
                            </div>
                          )}
                      </div>
                    </CardContent>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <CardTitle className="text-lg leading-tight">{reward.name}</CardTitle>
                          <Badge variant="secondary" className="w-fit mt-2">
                              <Star className="w-3 h-3 mr-1 text-accent fill-accent" />
                              {reward.points} Points
                          </Badge>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                              className="-mt-1 -mr-3 h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onSelect={() => setRewardToEdit(reward)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                              onSelect={() => setRewardToDelete(reward)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })
            ) : (
                  <Card className="sm:col-span-2 lg:col-span-3 xl:col-span-4">
                      <CardContent className="flex items-center justify-center h-48">
                          <p className="text-muted-foreground">No rewards added yet. Start by adding a new reward.</p>
                      </CardContent>
                  </Card>
            )}
          </div>
        </section>
      </div>

      {!!rewardToEdit && (
        <EditRewardDialog
          reward={rewardToEdit}
          isOpen={!!rewardToEdit}
          onOpenChange={(isOpen) => !isOpen && setRewardToEdit(null)}
          onSave={handleUpdateReward}
        />
      )}

      {!!rewardToDelete && (
        <AlertDialog
          open={!!rewardToDelete}
          onOpenChange={(isOpen) => !isOpen && setRewardToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the reward "{rewardToDelete.name}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90"
                onClick={() => handleDeleteReward(rewardToDelete.id)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
