"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Edit, Star, Trophy, Trash2 } from "lucide-react";
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
import { ClaimedRewardsDialog } from "./ClaimedRewardsDialog";

// Champion type
export type Champion = {
  id: string;
  name: string;
  avatarId: string;
  points: number;
  pointsToNextReward: number;
};

// Mock data for champions
const champions: Champion[] = [
  {
    id: "alex",
    name: "Alex",
    avatarId: "champion-alex",
    points: 125,
    pointsToNextReward: 200,
  },
  {
    id: "bella",
    name: "Bella",
    avatarId: "champion-bella",
    points: 85,
    pointsToNextReward: 150,
  },
];

export type Reward = {
  id: string;
  name: string;
  description: string;
  points: number;
  imageUrl?: string;
  imageHint?: string;
};

// Mock data for rewards
const initialRewards: Reward[] = [
  {
    id: "reward-screentime",
    name: "Extra Screen Time",
    description: "30 extra minutes of screen time on a device of your choice.",
    points: 75,
    imageUrl: "https://images.unsplash.com/photo-1746289434176-40f821d31216?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHx0YWJsZXQlMjBzY3JlZW58ZW58MHx8fHwxNzcwNjMzNDAzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    imageHint: "tablet screen"
  },
  {
    id: "reward-icecream",
    name: "Ice Cream Trip",
    description: "A family trip to the local ice cream parlor.",
    points: 150,
    imageUrl: "https://images.unsplash.com/photo-1560008581-09826d1de69e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxpY2UlMjBjcmVhbXxlbnwwfHx8fDE3NzA2MTU4Njl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    imageHint: "ice cream"
  },
  {
    id: "reward-movie",
    name: "Movie Night Choice",
    description: "You get to pick the movie for family movie night.",
    points: 200,
    imageUrl: "https://images.unsplash.com/photo-1620177088260-a9150572baf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxwb3Bjb3JuJTIwbW92aWV8ZW58MHx8fHwxNzcwNjY0NjA1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    imageHint: "popcorn movie"
  },
  {
    id: "reward-lego",
    name: "New Lego Set",
    description: "Pick out a new Lego set (up to a $25 value).",
    points: 500,
    imageUrl: "https://images.unsplash.com/photo-1636314229901-61b1c1da1675?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHx0b3klMjBibG9ja3N8ZW58MHx8fHwxNzcwNjY0NjA1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    imageHint: "toy blocks"
  },
];


export default function RewardsPage() {
  const { toast } = useToast();
  const [rewards, setRewards] = useState<Reward[]>(initialRewards);
  
  const [rewardToEdit, setRewardToEdit] = useState<Reward | null>(null);
  const [rewardToDelete, setRewardToDelete] = useState<Reward | null>(null);
  const [championForHistory, setChampionForHistory] = useState<Champion | null>(null);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isClaimedDialogOpen, setIsClaimedDialogOpen] = useState(false);

  const handleAddReward = useCallback((newRewardData: Omit<Reward, "id">) => {
    const newReward: Reward = {
      ...newRewardData,
      id: `new-reward-${Date.now()}`,
      description: newRewardData.description || ""
    };
    setRewards(prev => [newReward, ...prev]);
    setIsAddDialogOpen(false);
  }, []);

  const handleUpdateReward = useCallback((updatedReward: Reward) => {
    setRewards(prev => prev.map(r => r.id === updatedReward.id ? updatedReward : r));
    toast({
      title: "Reward Updated!",
      description: `${updatedReward.name} has been updated.`,
    });
    setIsEditDialogOpen(false);
  }, [toast]);

  const handleConfirmDelete = useCallback(() => {
    if (!rewardToDelete) return;
    const rewardName = rewardToDelete.name;
    setRewards(prev => prev.filter(r => r.id !== rewardToDelete.id));
    toast({
      title: "Reward Deleted",
      description: `${rewardName} has been removed from the catalog.`,
    });
    setRewardToDelete(null);
    setIsDeleteDialogOpen(false);
  }, [rewardToDelete, toast]);

  const openEditDialog = useCallback((reward: Reward) => {
    setRewardToEdit(reward);
    setIsEditDialogOpen(true);
  }, []);

  const openDeleteDialog = useCallback((reward: Reward) => {
    setRewardToDelete(reward);
    setIsDeleteDialogOpen(true);
  }, []);

  const openClaimedDialog = useCallback((champion: Champion) => {
    setChampionForHistory(champion);
    setIsClaimedDialogOpen(true);
  }, []);

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
                    <div className="p-6 pt-0">
                      <Button variant="outline" className="w-full" onClick={() => openClaimedDialog(champion)}>View Claimed Rewards</Button>
                    </div>
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
              rewards.map((reward) => (
                  <Card key={reward.id} className="overflow-hidden flex flex-col">
                    <CardContent className="p-0">
                      <div className="relative aspect-[4/3] bg-muted">
                          {reward.imageUrl ? (
                            <Image src={reward.imageUrl} alt={reward.name} fill className="object-cover" data-ai-hint={reward.imageHint} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-secondary">
                                <Trophy className="w-12 h-12 text-muted-foreground" />
                            </div>
                          )}
                      </div>
                    </CardContent>
                    <div className="p-6 flex-grow flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg leading-tight">{reward.name}</CardTitle>
                            <Badge variant="secondary" className="w-fit mt-2">
                                <Star className="w-3 h-3 mr-1 text-accent fill-accent" />
                                {reward.points} Points
                            </Badge>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => openEditDialog(reward)}>
                                <Edit className="h-3 w-3" />
                                <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="destructive" size="icon" className="h-7 w-7" onClick={() => openDeleteDialog(reward)}>
                                <Trash2 className="h-3 w-3" />
                                <span className="sr-only">Delete</span>
                            </Button>
                        </div>
                    </div>
                  </Card>
                )
              )
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

      {rewardToEdit && (
        <EditRewardDialog
          reward={rewardToEdit}
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleUpdateReward}
        />
      )}

      {rewardToDelete && (
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the reward "{rewardToDelete.name}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setRewardToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90"
                onClick={handleConfirmDelete}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {championForHistory && (
        <ClaimedRewardsDialog
            champion={championForHistory}
            isOpen={isClaimedDialogOpen}
            onOpenChange={setIsClaimedDialogOpen}
        />
      )}
    </>
  );
}
