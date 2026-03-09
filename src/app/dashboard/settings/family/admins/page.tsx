
'use client';

import { useState, useCallback } from "react";
import Link from "next/link";
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
import { PlusCircle, Edit, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc, deleteDocumentNonBlocking } from "@/firebase";
import { doc, query, collection, where } from "firebase/firestore";

export type Admin = {
  id: string;
  familyId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
};

export default function AdminsPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  // Fetch current parent's profile to get familyId
  const parentDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);
  const { data: currentParent, isLoading: isProfileLoading } = useDoc<Admin>(parentDocRef);

  // Fetch all admins in the same family
  const adminsQuery = useMemoFirebase(() => {
    if (!firestore || !currentParent?.familyId) return null;
    return query(collection(firestore, 'users'), where('familyId', '==', currentParent.familyId));
  }, [firestore, currentParent?.familyId]);

  const { data: admins, isLoading: isAdminsLoading } = useCollection<Admin>(adminsQuery);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  const handleConfirmDelete = useCallback(() => {
    if (!selectedAdmin || !firestore) return;
    
    // Prevent self-deletion from this view for safety
    if (selectedAdmin.id === user?.uid) {
        toast({
            variant: "destructive",
            title: "Action Restricted",
            description: "You cannot remove yourself from the admin list here. Use Account Settings to delete your account."
        });
        setIsDeleteDialogOpen(false);
        return;
    }

    const docRef = doc(firestore, 'users', selectedAdmin.id);
    deleteDocumentNonBlocking(docRef);
    
    toast({
      title: "Admin Removed",
      description: `${selectedAdmin.firstName} has been removed from the family admins.`,
      variant: 'destructive'
    });
    setIsDeleteDialogOpen(false);
  }, [selectedAdmin, firestore, user?.uid, toast]);

  const openDeleteDialog = useCallback((admin: Admin) => {
    setSelectedAdmin(admin);
    setIsDeleteDialogOpen(true);
  }, []);

  if (isProfileLoading || isAdminsLoading) {
      return (
          <div className="flex h-screen w-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
          </div>
      );
  }

  return (
    <div className="space-y-6">
       <Button asChild variant="outline" className="w-fit">
        <Link href="/dashboard/settings/family">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Family Settings
        </Link>
      </Button>
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>Admins</CardTitle>
            <CardDescription>
              Parent or guardian accounts with full access to manage chores and rewards. These are automatically linked during family setup.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Avatar</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins && admins.length > 0 ? (
                admins.map((admin) => {
                    const fullName = `${admin.firstName} ${admin.lastName}`;
                    const isSelf = admin.id === user?.uid;
                    return (
                    <TableRow key={admin.id}>
                      <TableCell className="hidden sm:table-cell">
                        <Avatar className="h-12 w-12 border-2 border-black">
                          <AvatarImage
                            src={admin.avatarUrl}
                            alt={fullName}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {admin.firstName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        {fullName} {isSelf && <span className="text-xs text-muted-foreground ml-1">(You)</span>}
                      </TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell className="hidden md:table-cell">{admin.phoneNumber || '—'}</TableCell>
                      <TableCell className="text-right">
                        {!isSelf && (
                            <div className="flex items-center justify-end gap-2">
                                <Button variant="destructive" size="icon-sm" onClick={() => openDeleteDialog(admin)} title="Remove Admin">
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )})
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No admins found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        {selectedAdmin && (
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove {selectedAdmin.firstName} {selectedAdmin.lastName} from the family admins list. They will no longer have access to this family dashboard.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive hover:bg-destructive/90"
                  onClick={handleConfirmDelete}
                >
                  Remove Admin
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
        )}
      </AlertDialog>
    </div>
  );
}
