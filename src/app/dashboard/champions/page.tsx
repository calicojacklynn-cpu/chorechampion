
"use client";

import { useState, useCallback, useMemo } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, collection, query, where } from 'firebase/firestore';
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
import { PlusCircle, Edit, Trash2, Copy, CheckCircle2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth, useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { firebaseConfig } from "@/firebase/config";

export type Champion = {
  id: string; // Champion's UID
  parentId: string; // Parent's UID
  name: string;
  username: string; // This is the login code
  email: string;
  avatarUrl?: string;
  points: number;
};

export default function ChampionsPage() {
  const { toast } = useToast();
  const parentAuth = useAuth();
  const { user: parentUser } = useUser();
  const firestore = useFirestore();

  // Fetch champions from Firestore
  const championsQuery = useMemoFirebase(() => {
    if (!parentUser) return null;
    return query(collection(firestore, 'champions'), where('parentId', '==', parentUser.uid));
  }, [firestore, parentUser]);

  const { data: champions, isLoading: isLoadingChampions } = useCollection<Champion>(championsQuery);

  const [isAdding, setIsAdding] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [lastGeneratedCode, setLastGeneratedCode] = useState('');
  const [selectedChampion, setSelectedChampion] = useState<Champion | null>(null);

  const generateCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleAddChampion = useCallback(async (newChampionData: NewChampionData) => {
    if (!parentUser) {
        toast({ variant: "destructive", title: "Authentication Error", description: "You must be logged in to add a champion."});
        return;
    }
    setIsAdding(true);

    const code = generateCode();
    const internalEmail = `${code.toLowerCase()}@champions.app`;

    // Use a temporary app instance to create a new user without logging the parent out.
    const tempAppName = `temp-app-for-champion-creation-${Date.now()}`;
    const tempApp = initializeApp(firebaseConfig, tempAppName);
    const tempAuth = getAuth(tempApp);

    try {
      // 1. Create the champion user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(tempAuth, internalEmail, newChampionData.password);
      const newUserId = userCredential.user.uid;
      
      // 2. Update their Auth profile with the display name
      await updateProfile(userCredential.user, { displayName: newChampionData.name });
      
      // 3. Create the champion's profile document in Firestore
      const newChampion: Champion = {
        id: newUserId,
        parentId: parentUser.uid,
        name: newChampionData.name,
        username: code, // This is the login code
        email: internalEmail,
        avatarUrl: "",
        points: 0,
      };

      const championDocRef = doc(firestore, 'champions', newUserId);
      await setDoc(championDocRef, newChampion);

      setLastGeneratedCode(code);
      setIsAddDialogOpen(false);
      setIsSuccessDialogOpen(true);
      
      toast({
        title: "Champion Added!",
        description: `${newChampion.name} is now ready to log in.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to Add Champion",
        description: error.message,
      });
    } finally {
      await signOut(tempAuth);
      setIsAdding(false);
    }
  }, [parentUser, firestore, toast]);

  const handleUpdateChampion = useCallback(async (updatedChampion: Champion) => {
    try {
        const championDocRef = doc(firestore, 'champions', updatedChampion.id);
        await setDoc(championDocRef, updatedChampion, { merge: true });
        toast({
          title: "Champion Updated!",
          description: `${updatedChampion.name}'s details have been updated.`,
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

  const handleConfirmDelete = useCallback(() => {
    if (!selectedChampion) return;
    // Full deletion would happen here...
    toast({
      title: "Champion Deleted (UI Only)",
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
              Manage your champions. They log in using their unique codes.
            </CardDescription>
          </div>
          <Button
            size="sm"
            className="ml-auto gap-1"
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
                <TableHead>Login Code</TableHead>
                <TableHead className="hidden md:table-cell text-right">Points</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingChampions ? (
                 <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        Loading champions...
                    </TableCell>
                </TableRow>
              ) : champions && champions.length > 0 ? (
                champions.map((champion) => (
                    <TableRow key={champion.id}>
                      <TableCell className="hidden sm:table-cell">
                        <Avatar className="h-12 w-12 border-2 border-black">
                           <AvatarImage
                              src={champion.avatarUrl}
                              alt={champion.name}
                            />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {champion.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        {champion.name}
                      </TableCell>
                      <TableCell>
                        <code className="bg-muted px-2 py-1 rounded font-bold text-primary">{champion.username}</code>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-right font-bold">
                        {champion.points}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                           <Button variant="default" size="icon-sm" onClick={() => openEditDialog(champion)} title="Edit Profile">
                             <Edit className="h-3.5 w-3.5" />
                           </Button>
                           <Button variant="destructive" size="icon-sm" onClick={() => openDeleteDialog(champion)} title="Delete Champion">
                              <Trash2 className="h-3.5 w-3.5" />
                           </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
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
        isAdding={isAdding}
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

      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-12 w-12 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-headline">Champion Ready!</DialogTitle>
            <DialogDescription>
              Share this code with your champion so they can log in.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted p-6 rounded-xl space-y-4 my-4">
              <span className="text-4xl font-mono font-bold tracking-widest text-primary">{lastGeneratedCode}</span>
              <Button variant="outline" className="w-full" onClick={() => {
                  navigator.clipboard.writeText(lastGeneratedCode);
                  toast({ title: "Code copied!" });
              }}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Code
              </Button>
          </div>
          <Button onClick={() => setIsSuccessDialogOpen(false)} className="w-full">
              Got it
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
