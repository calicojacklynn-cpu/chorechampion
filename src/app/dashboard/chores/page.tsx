"use client";

import { useState, useCallback } from "react";
import { Plus, Star, Edit, Trash2, Wand2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

import { AddChoreDialog } from "./AddChoreDialog";
import { EditChoreDialog } from "./EditChoreDialog";
import { AssignChoreDialog } from "./AssignChoreDialog";
import { useToast } from "@/hooks/use-toast";
import { useSchedule } from "@/app/context/ScheduleContext";
import type { ChoreAssignment } from "@/ai";

export type Chore = {
  id: string;
  name: string;
  description?: string;
  points: number;
};

// Mock data for initial custom chores
const initialChores: Chore[] = [
  {
    id: "chore-1",
    name: "Water the plants",
    description: "Water all indoor and outdoor plants.",
    points: 5,
  },
  {
    id: "chore-2",
    name: "Set the dinner table",
    points: 3,
  },
];

// Mock data for preset chores
const presetChores = [
  { name: "Take out the trash", points: 5 },
  { name: "Wash the dishes", points: 10 },
  { name: "Walk the dog", points: 8 },
  { name: "Clean your room", points: 15 },
  { name: "Feed the pets", points: 3 },
  { name: "Fold laundry", points: 7 },
];


export default function ChoresPage() {
  const { toast } = useToast();
  const [chores, setChores] = useState<Chore[]>(initialChores);
  const { setSchedule } = useSchedule();

  const [choreToAssign, setChoreToAssign] = useState<Chore | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  
  const [choreToEdit, setChoreToEdit] = useState<Chore | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const [choreToDelete, setChoreToDelete] = useState<Chore | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  

  const handleAddChore = useCallback((newChoreData: Omit<Chore, "id">) => {
    const newChore: Chore = {
      ...newChoreData,
      id: `chore-${Date.now()}`,
    };
    setChores((prev) => [newChore, ...prev]);
  }, []);

  const handleUpdateChore = useCallback((updatedChore: Chore) => {
    setChores((prev) =>
      prev.map((c) => (c.id === updatedChore.id ? updatedChore : c))
    );
    toast({
      title: "Chore Updated!",
      description: `${updatedChore.name}'s details have been updated.`,
    });
    setIsEditDialogOpen(false);
  }, [toast]);
  
  const handleConfirmDelete = useCallback(() => {
    if (!choreToDelete) return;
    setChores((prev) => prev.filter((c) => c.id !== choreToDelete.id));
    toast({
      title: "Chore Deleted",
      description: `${choreToDelete.name} has been removed.`,
      variant: "destructive",
    });
    setIsDeleteDialogOpen(false);
    setChoreToDelete(null);
  }, [choreToDelete, toast]);

  const handleAddPreset = useCallback((preset: { name: string; points: number }) => {
    if (chores.some(chore => chore.name.toLowerCase() === preset.name.toLowerCase())) {
        toast({
            variant: "default",
            title: "Chore already exists",
            description: `"${preset.name}" is already in your chore library.`,
        });
        return;
    }
    
    const newChore: Chore = {
      ...preset,
      id: `chore-${Date.now()}`,
      description: "",
    };
    setChores(prev => [newChore, ...prev]);
    toast({
        title: "Chore Added",
        description: `"${preset.name}" has been added to your library.`,
    });
  }, [chores, toast]);

  const handleAssignChore = useCallback((newAssignments: ChoreAssignment[]) => {
    setSchedule((prevSchedule) => [...prevSchedule, ...newAssignments]);
  }, [setSchedule]);

  const openAssignDialog = useCallback((chore: Chore) => {
    setChoreToAssign(chore);
    setIsAssignDialogOpen(true);
  }, []);
  
  const openEditDialog = useCallback((chore: Chore) => {
    setChoreToEdit(chore);
    setIsEditDialogOpen(true);
  }, []);

  const openDeleteDialog = useCallback((chore: Chore) => {
    setChoreToDelete(chore);
    setIsDeleteDialogOpen(true);
  }, []);

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Chore Management</h1>
            <p className="text-muted-foreground">Organize and assign chores for your champions.</p>
          </div>
          <AddChoreDialog onAdd={handleAddChore} />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          <div className="lg:col-span-2">
              <Card>
                  <CardHeader>
                      <CardTitle>Your Chore Library</CardTitle>
                      <CardDescription>A list of all available chores. Add new ones or pick from the presets.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                          <TableHeader>
                              <TableRow>
                                  <TableHead>Chore</TableHead>
                                  <TableHead className="text-center">Points</TableHead>
                                  <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {chores.length > 0 ? (
                                  chores.map((chore) => (
                                      <TableRow key={chore.id}>
                                          <TableCell className="align-top">
                                              <div className="font-medium">{chore.name}</div>
                                              {chore.description && <div className="text-sm text-muted-foreground">{chore.description}</div>}
                                          </TableCell>
                                          <TableCell className="text-center align-top">
                                              <Badge variant="secondary" className="w-fit">
                                                  <Star className="w-3 h-3 mr-1 text-accent fill-accent stroke-black" />
                                                  {chore.points}
                                              </Badge>
                                          </TableCell>
                                          <TableCell className="text-right align-top">
                                              <div className="flex flex-col items-end gap-1">
                                                  <Button variant="primary" size="icon-sm" onClick={() => openAssignDialog(chore)} title="AI Schedule Chore">
                                                      <Wand2 className="h-4 w-4" />
                                                      <span className="sr-only">AI Schedule Chore</span>
                                                  </Button>
                                                  <Button variant="primary" size="icon-sm" onClick={() => openEditDialog(chore)} title="Edit Chore">
                                                      <Edit className="h-4 w-4" />
                                                      <span className="sr-only">Edit Chore</span>
                                                  </Button>
                                                  <Button variant="destructive" size="icon-sm" onClick={() => openDeleteDialog(chore)} title="Delete Chore">
                                                      <Trash2 className="h-4 w-4" />
                                                      <span className="sr-only">Delete Chore</span>
                                                  </Button>
                                              </div>
                                          </TableCell>
                                      </TableRow>
                                  ))
                              ) : (
                                  <TableRow>
                                      <TableCell colSpan={3} className="h-24 text-center">
                                          No chores yet. Add a chore or pick from the presets.
                                      </TableCell>
                                  </TableRow>
                              )}
                          </TableBody>
                      </Table>
                  </CardContent>
              </Card>
          </div>

          <div className="lg:col-span-1">
              <Card>
                  <CardHeader>
                      <CardTitle>Quick Add Presets</CardTitle>
                      <CardDescription>Add common chores to your library with one click.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                      {presetChores.map((preset) => (
                          <Button key={preset.name} variant="primary" size="sm" onClick={() => handleAddPreset(preset)}>
                              <Plus className="mr-2 h-4 w-4" />
                              {preset.name}
                          </Button>
                      ))}
                  </CardContent>
              </Card>
          </div>

        </div>
      </div>
      <AssignChoreDialog
        chore={choreToAssign}
        isOpen={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        onAssign={handleAssignChore}
      />
      <EditChoreDialog
        chore={choreToEdit}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleUpdateChore}
      />
       <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        {choreToDelete && (
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the chore "{choreToDelete.name}".
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
