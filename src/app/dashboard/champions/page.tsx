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
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddChampionDialog } from "./AddChampionDialog";
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

type NewChampionData = { name: string; username: string; pin: string };

// Mock data for champions
const initialChampions: Champion[] = [
  {
    id: "alex",
    name: "Alex",
    username: "alex-the-great",
    avatarUrl: "https://images.unsplash.com/photo-1587743368367-67ec3ec37a5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxjaGlsZCUyMGZhY2V8ZW58MHx8fHwxNzcwNTUzOTMyfDA&ixlib=rb-4.1.0&q=80&w=1080",
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

  // State to manage which champion is being edited or deleted
  const [editingChampion, setEditingChampion] = useState<Champion | null>(null);
  const [deletingChampion, setDeletingChampion] = useState<Champion | null>(null);

  // --- Callbacks for Champion Data Manipulation ---
  const handleAddChampion = useCallback((newChampionData: NewChampionData) => {
    setChampions((prev) => {
      const newChampion: Champion = {
        ...newChampionData,
        id: newChampionData.username.toLowerCase(),
        avatarUrl: "",
        points: 0,
        choresCompleted: 0,
      };
      return [newChampion, ...prev];
    });
  }, []);

  const handleUpdateChampion = useCallback((updatedChampion: Champion) => {
    setChampions((prev) =>
      prev.map((c) => (c.id === updatedChampion.id ? updatedChampion : c))
    );
    toast({
      title: "Champion Updated!",
      description: `${updatedChampion.name}'s details have been updated.`,
    });
    setEditingChampion(null); // Close dialog on save
  }, [toast]);

  const handleConfirmDelete = useCallback(() => {
    if (!deletingChampion) return;
    setChampions((prev) => prev.filter((c) => c.id !== deletingChampion.id));
    toast({
      title: "Champion Deleted",
      description: `${deletingChampion.name} has been removed.`,
    });
    setDeletingChampion(null); // Close dialog on delete
  }, [deletingChampion, toast]);


  // --- Callbacks for Dialog State Management ---
  const handleEditOpenChange = useCallback((isOpen: boolean) => {
    if (!isOpen) {
        setEditingChampion(null);
    }
  }, []);

  const handleDeleteOpenChange = useCallback((isOpen: boolean) => {
    if (!isOpen) {
      setDeletingChampion(null);
    }
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
                <TableHead>Username</TableHead>
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
                              onSelect={() => setEditingChampion(champion)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                              onSelect={() => setDeletingChampion(champion)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
      
      {/* Edit Champion Dialog */}
      {editingChampion && (
        <EditChampionDialog
          key={editingChampion.id} // Using key to force re-mount and reset form state
          champion={editingChampion}
          isOpen={!!editingChampion}
          onOpenChange={handleEditOpenChange}
          onSave={handleUpdateChampion}
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingChampion}
        onOpenChange={handleDeleteOpenChange}
      >
        {deletingChampion && (
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete{" "}
                  {deletingChampion.name}.
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
