'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Star, Loader2 } from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import type { Champion } from "./page";

type ClaimedReward = {
    id: string;
    rewardName: string;
    pointsCost: number;
    redemptionDate: string;
    status: string;
};

type ClaimedRewardsDialogProps = {
  champion: Champion | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function ClaimedRewardsDialog({ champion, isOpen, onOpenChange }: ClaimedRewardsDialogProps) {
  const firestore = useFirestore();

  const historyQuery = useMemoFirebase(() => {
    if (!firestore || !champion || !isOpen) return null;
    return query(
        collection(firestore, 'champions', champion.id, 'redeemedRewards'),
        orderBy('redemptionDate', 'desc')
    );
  }, [firestore, champion, isOpen]);

  const { data: rewards, isLoading } = useCollection<ClaimedReward>(historyQuery);

  if (!champion) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Claimed Rewards: {champion.name}</DialogTitle>
          <DialogDescription>
            A history of all the rewards {champion.name} has redeemed.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
            {isLoading ? (
                <div className="flex justify-center p-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Reward</TableHead>
                            <TableHead>Cost</TableHead>
                            <TableHead className="text-right">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rewards && rewards.length > 0 ? (
                            rewards.map((reward) => (
                                <TableRow key={reward.id}>
                                    <TableCell className="font-medium">{reward.rewardName}</TableCell>
                                    <TableCell>
                                         <Badge variant="secondary" className="w-fit">
                                            <Star className="w-3 h-3 mr-1 text-accent fill-accent stroke-black" />
                                            {reward.pointsCost}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {new Date(reward.redemptionDate).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                    No rewards have been claimed yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
