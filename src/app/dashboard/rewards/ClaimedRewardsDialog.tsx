"use client";

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
import { Star } from "lucide-react";
import type { Champion } from "./page";

// Mock data for claimed rewards - in a real app, this would be fetched
const claimedRewardsData = {
    alex: [
        { id: 'claimed-1', rewardName: 'Extra Screen Time', points: 75, date: '2024-07-15' },
    ],
    bella: [
        { id: 'claimed-2', rewardName: 'Ice Cream Trip', points: 150, date: '2024-06-28' },
        { id: 'claimed-3', rewardName: 'Extra Screen Time', points: 75, date: '2024-05-12' },
    ]
};

type ClaimedRewardsDialogProps = {
  champion: Champion | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function ClaimedRewardsDialog({ champion, isOpen, onOpenChange }: ClaimedRewardsDialogProps) {
  if (!champion) return null;
  
  const rewards = claimedRewardsData[champion.id as keyof typeof claimedRewardsData] || [];

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
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Reward</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead className="text-right">Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rewards.length > 0 ? (
                        rewards.map(reward => (
                            <TableRow key={reward.id}>
                                <TableCell className="font-medium">{reward.rewardName}</TableCell>
                                <TableCell>
                                     <Badge variant="secondary" className="w-fit">
                                        <Star className="w-3 h-3 mr-1 text-accent fill-accent" />
                                        {reward.points}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">{reward.date}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3} className="h-24 text-center">
                                No rewards have been claimed yet.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
