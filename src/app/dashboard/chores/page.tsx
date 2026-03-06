
"use client";

import { useState, useCallback } from "react";
import { Plus, Star, Edit, Trash2, Wand2, Loader2 } from "lucide-react";
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
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { collection, doc, query } from "firebase/firestore";
import type { ChoreAssignment } from "@/ai";

export type Chore = {
  id: string;
  name: string;
  description?: string;
  points: number;
};

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
  const { user } = useUser();
  const firestore = useFirestore();
  const { setSchedule } = useSchedule();

  const choresQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'users', user.uid, 'chores'));
  }, [firestore, user]);

  const { data: chores, isLoading } = useCollection<Chore>(choresQuery);

  const [choreToAssign, setChoreToAssign] = useState<Chore | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [choreToEdit, setChoreToEdit] = useState<Chore | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [choreToDelete, setChoreToDelete] = useState<Chore | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleAddChore = useCallback((newChoreData: Omit<Chore, "id">) => {
    if (!user || !firestore) return;
    const colRef = collection(firestore, 'users', user.uid, 'chores');
    addDocumentNonBlocking(colRef, newChoreData);
  }, [user, firestore]);

  const handleUpdateChore = useCallback((updatedChore: Chore) => {
    if (!user || !firestore) return;
    const docRef = doc(firestore, 'users', user.uid, 'chores', updatedChore.id);
    const { id, ...data } = updatedChore;
    updateDocumentNonBlocking(docRef, data);
    setIsEditDialogOpen(false);
  }, [user, firestore]);
  
  const handleConfirmDelete = useCallback(() => {
    if (!choreToDelete || !user || !firestore) return;
    const docRef = doc(firestore, 'users', user.uid, 'chores', choreToDelete.id);
    deleteDocumentNonBlocking(docRef);
    setIsDeleteDialogOpen(false);
    setChoreToDelete(null);
  }, [choreToDelete, user, firestore]);

  const handleAddPreset = useCallback((preset: { name: string; points: number }) => {
    if (chores?.some(chore => chore.name.toLowerCase() === preset.name.toLowerCase())) {
        toast({
            variant: "default",
            title: "Chore already exists",
            description: `"${preset.name}" is already in your chore library.`,
        });
        return;
    }
    handleAddChore({ ...preset, description: "" });
  }, [chores, handleAddChore, toast]);

  const handleAssignChore = useCallback((newAssignments: ChoreAssignment[]) => {
    // In a launch-ready state, this would also add documents to /champions/{id}/assignedChores
    // For now, we update local context which is used by the calendar
    setSchedule((prevSchedule) => [...prevSchedule, ...newAssignments]);
  }, [setSchedule]);

  if (isLoading) return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;

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
                              {chores && chores.length > 0 ? (
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
                                                  <Button variant="default" size="icon-sm" onClick={() => { setChoreToAssign(chore); setIsAssignDialogOpen(true); }} title="AI Schedule Chore">
                                                      <Wand2 className="h-4 w-4" />
                                                  </Button>
                                                  <Button variant="default" size="icon-sm" onClick={() => { setChoreToEdit(chore); setIsEditDialogOpen(true); }} title="Edit Chore">
                                                      <Edit className="h-4 w-4" />
                                                  </Button>
                                                  <Button variant="destructive" size="icon-sm" onClick={() => { setChoreToDelete(chore); setIsDeleteDialogOpen(true); }} title="Delete Chore">
                                                      <Trash2 className="h-4 w-4" />
                                                  </Button>
                                              </div>
                                          </TableCell>
                                      </TableRow>
                                  ))
                              ) : (
                                  <TableRow>
                                      <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                          No custom chores yet.
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
                      <CardDescription>Add common chores to your library.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                      {presetChores.map((preset) => (
                          <Button key={preset.name} size="sm" variant="outline" onClick={() => handleAddPreset(preset)}>
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
       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>Permanently delete "{choreToDelete?.name}".</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleConfirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
