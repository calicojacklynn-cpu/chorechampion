
"use client";

import { useState, useCallback } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, updateProfile, signOut, signInWithEmailAndPassword, deleteUser } from "firebase/auth";
import { doc, setDoc, collection, query, where, deleteDoc } from 'firebase/firestore';
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
import { PlusCircle, Edit, Trash2, Copy, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddAdventurerDialog, type NewAdventurerData } from "./AddChampionDialog";
import { useToast } from "@/hooks/use-toast";
import { EditAdventurerDialog } from "./EditChampionDialog";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth, useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { firebaseConfig } from "@/firebase/config";

const CHAMPION_INTERNAL_PASSWORD = "CHAMPION_INTERNAL_ACCESS";

export type Adventurer = {
  id: string; // Adventurer's UID
  parentId: string; // Parent's UID
  name: string;
  username: string; // This is the login code
  email: string;
  avatarUrl?: string;
  points: number;
  notificationPreferences?: {
    newQuestAlerts: boolean;
    questApprovedAlerts: boolean;
    rewardMilestoneAlerts: boolean;
    chatAlerts: boolean;
  };
};

export default function AdventurersPage() {
  const { toast } = useToast();
  const { user: parentUser } = useUser();
  const firestore = useFirestore();

  // Fetch adventurers from Firestore
  const adventurersQuery = useMemoFirebase(() => {
    if (!parentUser) return null;
    return query(collection(firestore, 'champions'), where('parentId', '==', parentUser.uid));
  }, [firestore, parentUser]);

  const { data: adventurers, isLoading: isLoadingAdventurers } = useCollection<Adventurer>(adventurersQuery);

  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [lastGeneratedCode, setLastGeneratedCode] = useState('');
  const [selectedAdventurer, setSelectedAdventurer] = useState<Adventurer | null>(null);

  const generateCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleAddAdventurer = useCallback(async (newAdventurerData: NewAdventurerData) => {
    if (!parentUser) {
        toast({ variant: "destructive", title: "Authentication Error", description: "You must be logged in to add an adventurer."});
        return;
    }
    setIsAdding(true);

    const code = generateCode();
    const internalEmail = `${code.toLowerCase()}@champions.app`;

    const tempAppName = `temp-app-for-adventurer-creation-${Date.now()}`;
    const tempApp = initializeApp(firebaseConfig, tempAppName);
    const tempAuth = getAuth(tempApp);

    try {
      const userCredential = await createUserWithEmailAndPassword(tempAuth, internalEmail, CHAMPION_INTERNAL_PASSWORD);
      const newUserId = userCredential.user.uid;
      
      await updateProfile(userCredential.user, { displayName: newAdventurerData.name });
      
      const newAdventurer: Adventurer = {
        id: newUserId,
        parentId: parentUser.uid,
        name: newAdventurerData.name,
        username: code,
        email: internalEmail,
        avatarUrl: "",
        points: 0,
        notificationPreferences: {
          newQuestAlerts: true,
          questApprovedAlerts: true,
          rewardMilestoneAlerts: false,
          chatAlerts: true
        }
      };

      const adventurerDocRef = doc(firestore, 'champions', newUserId);
      await setDoc(adventurerDocRef, newAdventurer);

      setLastGeneratedCode(code);
      setIsAddDialogOpen(false);
      setIsSuccessDialogOpen(true);
      
      toast({
        title: "Adventurer Ready!",
        description: `${newAdventurer.name} is now ready to begin their journey.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to Add Adventurer",
        description: error.message,
      });
    } finally {
      await signOut(tempAuth);
      setIsAdding(false);
    }
  }, [parentUser, firestore, toast]);

  const handleUpdateAdventurer = useCallback(async (updatedAdventurer: Adventurer) => {
    try {
        const adventurerDocRef = doc(firestore, 'champions', updatedAdventurer.id);
        await setDoc(adventurerDocRef, updatedAdventurer, { merge: true });
        toast({
          title: "Adventurer Updated!",
          description: `${updatedAdventurer.name}'s profile has been updated.`,
        });
        setIsEditDialogOpen(false);
    } catch(error: any) {
        toast({
            variant: "destructive",
            title: "Update Failed",
            description: error.message,
        });
    }
  }, [firestore, toast]);

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedAdventurer || !firestore) return;
    setIsDeleting(true);
    try {
      const adventurerDocRef = doc(firestore, 'champions', selectedAdventurer.id);
      await deleteDoc(adventurerDocRef);

      // Invalidate the code by deleting the adventurer's auth account
      try {
          const tempAppName = `temp-del-adv-${selectedAdventurer.id}`;
          const tempApp = initializeApp(firebaseConfig, tempAppName);
          const tempAuth = getAuth(tempApp);
          const internalEmail = `${selectedAdventurer.username.toLowerCase()}@champions.app`;
          const champCred = await signInWithEmailAndPassword(tempAuth, internalEmail, CHAMPION_INTERNAL_PASSWORD);
          await deleteUser(champCred.user);
          await signOut(tempAuth);
      } catch (e) {
          console.warn("Auth cleanup warning:", e);
      }

      toast({
        title: "Adventurer Retired",
        description: `${selectedAdventurer.name} has been removed from the family roster.`,
        variant: 'destructive'
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Retirement Failed",
        description: error.message,
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setSelectedAdventurer(null);
    }
  }, [selectedAdventurer, firestore, toast]);

  const openEditDialog = useCallback((adventurer: Adventurer) => {
    setSelectedAdventurer(adventurer);
    setIsEditDialogOpen(true);
  }, []);

  const openDeleteDialog = useCallback((adventurer: Adventurer) => {
    setSelectedAdventurer(adventurer);
    setIsDeleteDialogOpen(true);
  }, []);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>Adventurers</CardTitle>
            <CardDescription>
              Manage your adventurers. They log in using their unique codes.
            </CardDescription>
          </div>
          <Button
            size="sm"
            className="ml-auto gap-1"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Adventurer
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
                <TableHead>Login Code</TableHead>
                <TableHead className="hidden md:table-cell text-right">Points</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingAdventurers ? (
                 <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        Finding adventurers...
                    </TableCell>
                </TableRow>
              ) : adventurers && adventurers.length > 0 ? (
                adventurers.map((adventurer) => (
                    <TableRow key={adventurer.id}>
                      <TableCell className="hidden sm:table-cell">
                        <Avatar className="h-12 w-12 border-2 border-black">
                           <AvatarImage
                              src={adventurer.avatarUrl}
                              alt={adventurer.name}
                            />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {adventurer.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        {adventurer.name}
                      </TableCell>
                      <TableCell>
                        <code className="bg-muted px-2 py-1 rounded font-bold text-black">{adventurer.username}</code>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-right font-bold">
                        {adventurer.points}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                           <Button variant="default" size="icon-sm" onClick={() => openEditDialog(adventurer)} title="Edit Profile">
                             <Edit className="h-3.5 w-3.5" />
                           </Button>
                           <Button variant="destructive" size="icon-sm" onClick={() => openDeleteDialog(adventurer)} title="Remove Adventurer">
                              <Trash2 className="h-3.5 w-3.5" />
                           </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No adventurers added yet. Start by adding one to the roster!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <AddAdventurerDialog 
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddAdventurer}
        isAdding={isAdding}
      />

      {selectedAdventurer && (
        <EditAdventurerDialog
          adventurer={selectedAdventurer}
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleUpdateAdventurer}
        />
      )}
      
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        {selectedAdventurer && (
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently retire{" "}
                  {selectedAdventurer.name} and delete all their progress.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive hover:bg-destructive/90"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                >
                  {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Retire
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
        )}
      </AlertDialog>

      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-12 w-12 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-headline">Adventurer Ready!</DialogTitle>
            <DialogDescription>
              Share this code with your adventurer so they can begin their quests.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted p-6 rounded-xl space-y-4 my-4">
              <span className="text-4xl font-mono font-bold tracking-widest text-black">{lastGeneratedCode}</span>
              <Button variant="outline" className="w-full" onClick={() => {
                  navigator.clipboard.writeText(lastGeneratedCode);
                  toast({ title: "Code copied!" });
              }}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Code
              </Button>
          </div>
          <Button onClick={() => setIsSuccessDialogOpen(false)} className="w-full">
              Adventure Awaits!
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
