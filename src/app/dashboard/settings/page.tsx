
'use client';

import { useState, useEffect } from "react";
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
import { useUser, useFirestore, useAuth, useDoc, useMemoFirebase, updateDocumentNonBlocking } from "@/firebase";
import { doc, deleteDoc, writeBatch, collection, query, where, getDocs } from "firebase/firestore";
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
  const [isSavingProfile, setIsSavingSavingProfile] = useState(false);

  // Fetch real parent profile for fields like phone number and familyId
  const userRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);
  const { data: profile, isLoading: isProfileLoading } = useDoc(userRef);

  const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: ''
  });

  useEffect(() => {
      if (profile) {
          setFormData({
              firstName: profile.firstName || '',
              lastName: profile.lastName || '',
              email: profile.email || user?.email || '',
              phoneNumber: profile.phoneNumber || ''
          });
      }
  }, [profile, user?.email]);

  const handleSaveProfile = () => {
      if (!user || !firestore) return;
      setIsSavingSavingProfile(true);
      
      const docRef = doc(firestore, 'users', user.uid);
      updateDocumentNonBlocking(docRef, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber
      });

      toast({
          title: "Profile Updated",
          description: "Your personal details have been saved."
      });
      setIsSavingSavingProfile(false);
  };

  const handleDeleteAccount = async () => {
    if (!user || !firestore || !profile) return;

    // Proactive check: Sensitive operations need a recent login (usually < 5 mins)
    const lastSignIn = user.metadata.lastSignInTime;
    const lastSignInMillis = lastSignIn ? new Date(lastSignIn).getTime() : 0;
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
    
    // Anonymous users don't usually hit the fresh login requirement as hard, 
    // but standard accounts do.
    if (lastSignInMillis < fiveMinutesAgo && !user.isAnonymous) {
        toast({
            variant: "destructive",
            title: "Action Restricted",
            description: "For security, please log out and log back in before deleting your account.",
        });
        return;
    }

    setIsDeleting(true);
    
    try {
      const batch = writeBatch(firestore);
      const familyId = profile.familyId;

      // 1. Find and delete all champions for this parent
      const championsQuery = query(collection(firestore, 'champions'), where('parentId', '==', user.uid));
      const championsSnap = await getDocs(championsQuery);
      
      for (const champDoc of championsSnap.docs) {
          // Delete champion profile
          batch.delete(champDoc.ref);
          
          // Delete subcollections (assignedChores, redeemedRewards)
          const assignedChoresSnap = await getDocs(collection(firestore, 'champions', champDoc.id, 'assignedChores'));
          assignedChoresSnap.forEach(d => batch.delete(d.ref));
          
          const redeemedRewardsSnap = await getDocs(collection(firestore, 'champions', champDoc.id, 'redeemedRewards'));
          redeemedRewardsSnap.forEach(d => batch.delete(d.ref));
      }

      // 2. Delete shared messages, custom chores, and rewards for this parent
      const messagesSnap = await getDocs(collection(firestore, 'users', user.uid, 'messages'));
      messagesSnap.forEach(d => batch.delete(d.ref));

      const choresSnap = await getDocs(collection(firestore, 'users', user.uid, 'chores'));
      choresSnap.forEach(d => batch.delete(d.ref));

      const rewardsSnap = await getDocs(collection(firestore, 'users', user.uid, 'rewards'));
      rewardsSnap.forEach(d => batch.delete(d.ref));

      // 3. Find and delete all parents in the family
      if (familyId) {
          const parentsQuery = query(collection(firestore, 'users'), where('familyId', '==', familyId));
          const parentsSnap = await getDocs(parentsQuery);
          parentsSnap.forEach(d => batch.delete(d.ref));
      } else {
          batch.delete(doc(firestore, 'users', user.uid));
      }

      // Commit all Firestore deletions
      await batch.commit();

      // 4. Finally, delete the Auth Account
      await deleteUser(user);

      toast({
        title: "Account Deleted",
        description: "Your family group and all associated data have been permanently removed.",
      });

      router.push('/');
    } catch (error: any) {
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
            {isProfileLoading ? (
                <div className="flex justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input 
                                id="firstName" 
                                value={formData.firstName} 
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input 
                                id="lastName" 
                                value={formData.lastName} 
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={formData.email} disabled />
                        <p className="text-[10px] text-muted-foreground">Email is used for your secure login and cannot be changed here.</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input 
                            id="phoneNumber" 
                            type="tel" 
                            value={formData.phoneNumber} 
                            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        />
                    </div>
                </>
            )}
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button onClick={handleSaveProfile} disabled={isSavingProfile || isProfileLoading}>
                {isSavingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Profile
            </Button>
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
              <CardTitle className="text-lg">Delete Family Account</CardTitle>
              <CardDescription>
                Permanently delete your account, all family administrators, and all champion data. This action is irreversible.
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
                    This action cannot be undone. This will permanently delete the entire family group, including all parents and champions. All progress, messages, and rewards will be lost forever.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteAccount}
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  >
                    Yes, Delete Everything
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
