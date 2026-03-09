
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
import { Edit, Star, Trash2, Gift, Loader2 } from "lucide-react";
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
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { collection, doc, query, where } from "firebase/firestore";
import type { Adventurer } from "@/app/dashboard/champions/page";

export type Reward = {
  id: string;
  name: string;
  description: string;
  points: number;
  imageUrl?: string;
  imageHint?: string;
};

export default function RewardsPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  // Fetch adventurers to show standing
  const adventurersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'champions'), where('parentId', '==', user.uid));
  }, [firestore, user]);
  const { data: adventurers } = useCollection<Adventurer>(adventurersQuery);

  // Fetch rewards
  const rewardsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'users', user.uid, 'rewards'));
  }, [firestore, user]);
  const { data: rewards, isLoading } = useCollection<Reward>(rewardsQuery);
  
  const [rewardToEdit, setRewardToEdit] = useState<Reward | null>(null);
  const [rewardToDelete, setRewardToDelete] = useState<Reward | null>(null);
  const [adventurerForHistory, setAdventurerForHistory] = useState<Adventurer | null>(null);
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isClaimedDialogOpen, setIsClaimedDialogOpen] = useState(false);

  const handleAddReward = useCallback((newRewardData: Omit<Reward, "id">) => {
    if (!user || !firestore) return;
    const colRef = collection(firestore, 'users', user.uid, 'rewards');
    addDocumentNonBlocking(colRef, { ...newRewardData, parentId: user.uid });
  }, [user, firestore]);

  const handleUpdateReward = useCallback((updatedReward: Reward) => {
    if (!user || !firestore) return;
    const docRef = doc(firestore, 'users', user.uid, 'rewards', updatedReward.id);
    const { id, ...data } = updatedReward;
    updateDocumentNonBlocking(docRef, data);
    setIsEditDialogOpen(false);
  }, [user, firestore]);

  const handleConfirmDelete = useCallback(() => {
    if (!rewardToDelete || !user || !firestore) return;
    const docRef = doc(firestore, 'users', user.uid, 'rewards', rewardToDelete.id);
    deleteDocumentNonBlocking(docRef);
    setRewardToDelete(null);
    setIsDeleteDialogOpen(false);
  }, [rewardToDelete, user, firestore]);

  if (isLoading) return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
              <Gift className="h-8 w-8"/>
              Rewards & Recognition
          </h1>
          <p className="text-muted-foreground">
            Motivate your adventurers by rewarding their hard work with points.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight font-headline mb-4">Adventurer Standings</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {adventurers && adventurers.length > 0 ? (
              adventurers.map((adventurer) => {
                const nextReward = rewards?.find(r => r.points > adventurer.points)?.points || 500;
                const progress = Math.min(100, (adventurer.points / nextReward) * 100);
                return (
                  <Card key={adventurer.id} className="flex flex-col">
                    <CardHeader className="flex flex-row items-center gap-4">
                      <Avatar className="h-16 w-16 border-2 border-black bg-primary">
                        <AvatarImage src={adventurer.avatarUrl} alt={adventurer.name} className="object-cover" />
                        <AvatarFallback className="text-xl bg-primary text-primary-foreground">{adventurer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{adventurer.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-accent fill-accent stroke-black" />
                          <span className="font-bold text-lg text-foreground">{adventurer.points}</span> Points
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="text-sm text-muted-foreground mb-2">Progress:</div>
                      <Progress value={progress} className="h-2" />
                      <p className="text-xs text-right mt-1 text-muted-foreground">{adventurer.points} pts</p>
                    </CardContent>
                    <div className="p-6 pt-0">
                      <Button variant="outline" className="w-full" onClick={() => { setAdventurerForHistory(adventurer); setIsClaimedDialogOpen(true); }}>View Redemptions</Button>
                    </div>
                  </Card>
                );
              })
            ) : (
              <Card className="md:col-span-2 lg:col-span-3"><CardContent className="flex items-center justify-center h-32 text-muted-foreground">Add adventurers to track progress.</CardContent></Card>
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold tracking-tight font-headline">Reward Catalog</h2>
              <AddRewardDialog onAdd={handleAddReward} />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {rewards && rewards.length > 0 ? (
              rewards.map((reward) => (
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
                    <div className="p-6 flex-grow flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg leading-tight">{reward.name}</CardTitle>
                            <Badge variant="secondary" className="w-fit mt-2 text-sm">
                                <Star className="w-3 h-3 mr-1 text-accent fill-accent stroke-black" />
                                {reward.points} Points
                            </Badge>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setRewardToEdit(reward); setIsEditDialogOpen(true); }}><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { setRewardToDelete(reward); setIsDeleteDialogOpen(true); }}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    </div>
                  </Card>
                )
              )
            ) : (
                  <Card className="sm:col-span-2 lg:col-span-3 xl:grid-cols-4"><CardContent className="flex items-center justify-center h-48 text-muted-foreground">Catalog is empty.</CardContent></Card>
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>Delete the reward "{rewardToDelete?.name}".</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRewardToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleConfirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {adventurerForHistory && (
        <ClaimedRewardsDialog
            champion={adventurerForHistory}
            isOpen={isClaimedDialogOpen}
            onOpenChange={setIsClaimedDialogOpen}
        />
      )}
    </>
  );
}
