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
import { AddAdminDialog, type NewAdminData } from "./AddAdminDialog";
import { useToast } from "@/hooks/use-toast";
import { EditAdminDialog } from "./EditAdminDialog";
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

export type Admin = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
};

const initialAdmins: Admin[] = [
  {
    id: "parent-1",
    name: "Parent",
    email: "parent@example.com",
    avatarUrl: "",
  },
];

export default function AdminsPage() {
  const { toast } = useToast();
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  const handleAddAdmin = useCallback((newAdminData: NewAdminData) => {
    const newAdmin: Admin = {
      ...newAdminData,
      id: `admin-${Date.now()}`,
      avatarUrl: "", 
    };
    setAdmins((prev) => [newAdmin, ...prev]);
    toast({
      title: "Admin Added!",
      description: `${newAdmin.name} has been added to your list of admins.`,
    });
    setIsAddDialogOpen(false);
  }, [toast]);

  const handleUpdateAdmin = useCallback((updatedAdmin: Admin) => {
    setAdmins((prev) =>
      prev.map((c) => (c.id === updatedAdmin.id ? updatedAdmin : c))
    );
    toast({
      title: "Admin Updated!",
      description: `${updatedAdmin.name}'s details have been updated.`,
    });
    setIsEditDialogOpen(false);
  }, [toast]);

  const handleConfirmDelete = useCallback(() => {
    if (!selectedAdmin) return;
    setAdmins((prev) => prev.filter((c) => c.id !== selectedAdmin.id));
    toast({
      title: "Admin Deleted",
      description: `${selectedAdmin.name} has been removed.`,
      variant: 'destructive'
    });
    setIsDeleteDialogOpen(false);
  }, [selectedAdmin, toast]);

  const openEditDialog = useCallback((admin: Admin) => {
    setSelectedAdmin(admin);
    setIsEditDialogOpen(true);
  }, []);

  const openDeleteDialog = useCallback((admin: Admin) => {
    setSelectedAdmin(admin);
    setIsDeleteDialogOpen(true);
  }, []);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>Admins</CardTitle>
            <CardDescription>
              Manage parent or guardian accounts with admin privileges.
            </CardDescription>
          </div>
          <Button
            size="sm"
            className="ml-auto gap-1"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Admin
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
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.length > 0 ? (
                admins.map((admin) => {
                    return (
                    <TableRow key={admin.id}>
                      <TableCell className="hidden sm:table-cell">
                        <Avatar className="h-12 w-12 border">
                          <AvatarImage
                            src={admin.avatarUrl}
                            alt={admin.name}
                            className="object-cover"
                          />
                          <AvatarFallback>
                            {admin.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        {admin.name}
                      </TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                           <Button variant="outline" size="sm" onClick={() => openEditDialog(admin)}>
                             <Edit className="h-3.5 w-3.5" />
                           </Button>
                           <Button variant="destructive" size="icon-sm" onClick={() => openDeleteDialog(admin)}>
                              <Trash2 className="h-3.5 w-3.5" />
                           </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )})
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No admins added yet. Start by adding an admin.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <AddAdminDialog 
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddAdmin}
      />

      {selectedAdmin && (
        <EditAdminDialog
          admin={selectedAdmin}
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleUpdateAdmin}
        />
      )}
      
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        {selectedAdmin && (
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete{" "}
                  {selectedAdmin.name}.
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
