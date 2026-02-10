"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
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
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddChampionDialog, type NewChampionData } from "./AddChampionDialog";
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
  avatarUrl?: string;
  points: number;
  choresCompleted: number;
};

// Mock data for champions
const initialChampions: Champion[] = [
  {
    id: "alex",
    name: "Alex",
    username: "alex-the-great",
    avatarUrl: "https://images.unsplash.com/photo-1587743368367-67ec3e7a5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxjaGlsZCUyMGZhY2V8ZW58MHx8fHwxNzcwNTUzOTMyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    points: 125,
    choresCompleted: 12,
  },
  {
    id: "bella",
    name: "Bella",
    username: "bella-the-brave",
    avatarUrl: "https://images.unsplash.com/photo-1690237604597-d170faa1e40f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxjaGlsZCUyMGZhY2V8ZW58MHx8fHwxNzcwNTUzOTMyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    points: 85,
    choresCompleted: 8,
  },
];

export default function ChampionsPage() {
  const { toast } = useToast();
  const [champions, setChampions] = useState<Champion[]>(initialChampions);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [selectedChampion, setSelectedChampion] = useState<Champion | null>(null);

  const handleAddChampion = useCallback((newChampionData: NewChampionData) => {
    const newChampion: Champion = {
      ...newChampionData,
      id: newChampionData.username.toLowerCase(),
      avatarUrl: "",
      points: 0,
      choresCompleted: 0,
    };
    setChampions((prev) => [newChampion, ...prev]);
    toast({
      title: "Champion Added!",
      description: `${newChampion.name} has been added to your list of champions.`,
    });
    setIsAddDialogOpen(false);
  }, [toast]);

  const handleUpdateChampion = useCallback((updatedChampion: Champion) => {
    setChampions((prev) =>
      prev.map((c) => (c.id === updatedChampion.id ? updatedChampion : c))
    );
    toast({
      title: "Champion Updated!",
      description: `${updatedChampion.name}'s details have been updated.`,
    });
    setIsEditDialogOpen(false);
  }, [toast]);

  const handleConfirmDelete = useCallback(() => {
    if (!selectedChampion) return;
    setChampions((prev) => prev.filter((c) => c.id !== selectedChampion.id));
    toast({
      title: "Champion Deleted",
      description: `${selectedChampion.name} has been removed.`,
      variant: 'destructive'
    });
    setIsDeleteDialogOpen(false);
  }, [selectedChampion, toast]);

  const openEditDialog = useCallback((champion: Champion) => {
    setSelectedChampion(champion);
    setIsEditDialogOpen(true);
  }, []);

  const openDeleteDialog = useCallback((champion: Champion) => {
    setSelectedChampion(champion);
    setIsDeleteDialogOpen(true);
  }, []);

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
          <Button
            size="sm"
            className="ml-auto gap-1 bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Champion
            </span>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Avatar</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead className="hidden md:table-cell">Points</TableHead>
                <TableHead className="hidden md:table-cell">
                  Chores Completed
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {champions.length > 0 ? (
                champions.map((champion) => (
                    <TableRow key={champion.id}>
                      <TableCell className="hidden sm:table-cell">
                        <Avatar className="h-12 w-12 border">
                          {champion.avatarUrl ? (
                            <AvatarImage asChild src={champion.avatarUrl}>
                              <Image
                                src={champion.avatarUrl}
                                width={48}
                                height={48}
                                alt={champion.name}
                                className="object-cover"
                              />
                            </AvatarImage>
                          ) : null}
                          <AvatarFallback>
                            {champion.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        {champion.name}
                      </TableCell>
                      <TableCell>{champion.username}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {champion.points}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {champion.choresCompleted}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                           <Button variant="outline" size="sm" onClick={() => openEditDialog(champion)}>
                             <Edit className="h-3.5 w-3.5" />
                           </Button>
                           <Button variant="destructive" size="icon-sm" onClick={() => openDeleteDialog(champion)}>
                              <Trash2 className="h-3.5 w-3.5" />
                           </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
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
      
      <AddChampionDialog 
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddChampion}
      />

      {selectedChampion && (
        <EditChampionDialog
          champion={selectedChampion}
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleUpdateChampion}
        />
      )}
      
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        {selectedChampion && (
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete{" "}
                  {selectedChampion.name}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive hover:bg-destructive/90"
                  onClick={handleConfirmDelete}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
        )}
      </AlertDialog>
    </>
  );
}
