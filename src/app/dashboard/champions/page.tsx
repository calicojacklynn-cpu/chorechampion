"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddChampionDialog } from "./AddChampionDialog";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";
import { EditChampionDialog } from "./EditChampionDialog";
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

export type Champion = {
  id: string;
  name: string;
  username: string;
  avatarId: string;
  points: number;
  choresCompleted: number;
};

// Mock data for champions
const initialChampions: Champion[] = [
  {
    id: "alex",
    name: "Alex",
    username: "alex-the-great",
    avatarId: "champion-alex",
    points: 125,
    choresCompleted: 12,
  },
  {
    id: "bella",
    name: "Bella",
    username: "bella-the-brave",
    avatarId: "champion-bella",
    points: 85,
    choresCompleted: 8,
  },
];

export default function ChampionsPage() {
  const { toast } = useToast();
  const [champions, setChampions] = useState<Champion[]>(initialChampions);
  const [championToEdit, setChampionToEdit] = useState<Champion | null>(null);
  const [championToDelete, setChampionToDelete] = useState<Champion | null>(
    null
  );

  type NewChampionData = { name: string; username: string; pin: string };

  const handleAddChampion = (newChampionData: NewChampionData) => {
    const newChampion: Champion = {
      ...newChampionData,
      id: newChampionData.username.toLowerCase(),
      avatarId: "champion-charlie", // Use a generic avatar for new champs
      points: 0,
      choresCompleted: 0,
    };
    setChampions([newChampion, ...champions]);
  };

  const handleUpdateChampion = (updatedChampion: Champion) => {
    setChampions(
      champions.map((c) => (c.id === updatedChampion.id ? updatedChampion : c))
    );
    toast({
      title: "Champion Updated!",
      description: `${updatedChampion.name}'s details have been updated.`,
    });
    setChampionToEdit(null);
  };

  const handleDeleteChampion = (championId: string) => {
    const championName = champions.find((c) => c.id === championId)?.name;
    setChampions(champions.filter((c) => c.id !== championId));
    toast({
      title: "Champion Deleted",
      description: `${championName} has been removed from your list of champions.`,
    });
    setChampionToDelete(null);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>Champions</CardTitle>
            <CardDescription>
              Manage your champions and view their progress.
            </CardDescription>
          </div>
          <AddChampionDialog onAdd={handleAddChampion} />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Avatar</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Username</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Points</TableHead>
                <TableHead className="hidden md:table-cell">
                  Chores Completed
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {champions.length > 0 ? (
                champions.map((champion) => {
                  const championAvatar = PlaceHolderImages.find(
                    (p) => p.id === champion.avatarId
                  );
                  return (
                    <TableRow key={champion.id}>
                      <TableCell className="hidden sm:table-cell">
                        <Avatar className="h-12 w-12 border">
                          {championAvatar && (
                            <AvatarImage asChild src={championAvatar.imageUrl}>
                              <Image
                                src={championAvatar.imageUrl}
                                width={48}
                                height={48}
                                alt={champion.name}
                                data-ai-hint={championAvatar.imageHint}
                              />
                            </AvatarImage>
                          )}
                          <AvatarFallback>
                            {champion.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        {champion.name}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{champion.username}</TableCell>
                      <TableCell>
                        <Badge variant="outline">Active</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {champion.points}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {champion.choresCompleted}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onSelect={() => setChampionToEdit(champion)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                              onSelect={() => setChampionToDelete(champion)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No champions added yet. Start by adding a champion.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {!!championToEdit && (
        <EditChampionDialog
          champion={championToEdit}
          isOpen={!!championToEdit}
          onOpenChange={(isOpen) => !isOpen && setChampionToEdit(null)}
          onSave={handleUpdateChampion}
        />
      )}
      {!!championToDelete && (
        <AlertDialog
          open={!!championToDelete}
          onOpenChange={(isOpen) => !isOpen && setChampionToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete{" "}
                {championToDelete.name}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90"
                onClick={() => handleDeleteChampion(championToDelete.id)}
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
