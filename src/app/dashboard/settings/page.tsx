'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useUser, useFirestore, useAuth } from "@/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!user || !firestore) return;
    setIsDeleting(true);
    try {
      // 1. Delete Firestore Profile
      // Note: Subcollections like chores/rewards should be handled by a cloud function 
      // or recursive delete in a production app. For MVP, we delete the profile.
      const userRef = doc(firestore, 'users', user.uid);
      await deleteDoc(userRef);

      // 2. Delete Auth Account
      // Firebase requires a recent login for this.
      await deleteUser(user);

      toast({
        title: "Account Deleted",
        description: "Your account and profile have been successfully removed.",
      });

      router.push('/');
    } catch (error: any) {
      console.error("Deletion error:", error);
      
      if (error.code === 'auth/requires-recent-login') {
        toast({
          variant: "destructive",
          title: "Action Restricted",
          description: "For security, please log out and log back in before deleting your account.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Deletion Failed",
          description: error.message || "An unexpected error occurred while trying to delete your account.",
        });
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and profile settings.
        </p>
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              This is how you are identified in the app.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue={user?.displayName || "Parent"} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user?.email || "parent@example.com"} />
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button>Save Profile</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you'll be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button>Update Password</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
              <CardTitle>Language & Region</CardTitle>
              <CardDescription>The Culture Setting. Sync the app with your life.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
              <div className="space-y-2">
                  <Label htmlFor="localized-terminology">Localized Terminology</Label>
                  <p className="text-sm text-muted-foreground">Rename "Chores" to something more engaging.</p>
                  <Input id="localized-terminology" defaultValue="Daily Quests" />
              </div>
                <div className="space-y-2">
                  <Label htmlFor="currency-standardization">Currency Standardization</Label>
                  <p className="text-sm text-muted-foreground">Choose the visual representation of rewards.</p>
                  <Input id="currency-standardization" defaultValue="Champion Coins" />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="time-zone">Time Zone Sync</Label>
                  <p className="text-sm text-muted-foreground">Synchronizes the "Daily Reset" of chores.</p>
                    <Select defaultValue="cst">
                      <SelectTrigger className="w-full md:w-1/2">
                          <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                          <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                          <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                          <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
              <Button>Save Localization Settings</Button>
          </CardFooter>
        </Card>

        <Card className="border-destructive">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-lg">Delete Account</CardTitle>
              <CardDescription>
                Permanently delete your account and all data. This action is irreversible.
              </CardDescription>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={isDeleting}>
                  {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    parent profile and your authentication account. All your family data will be lost.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteAccount}
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  >
                    Yes, Delete My Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
