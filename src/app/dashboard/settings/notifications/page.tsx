
'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase, updateDocumentNonBlocking } from "@/firebase";
import { doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

type ParentProfile = {
  notificationPreferences?: {
    approvalAlerts: boolean;
    rewardMilestones: boolean;
    rewardClaimed: boolean;
    chatAlerts: boolean;
  };
};

export default function NotificationSettingsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: profile, isLoading } = useDoc<ParentProfile>(userDocRef);

  const updatePreference = (key: string, value: boolean) => {
    if (!user || !firestore) return;
    const docRef = doc(firestore, 'users', user.uid);
    updateDocumentNonBlocking(docRef, {
      notificationPreferences: {
        ...(profile?.notificationPreferences || {}),
        [key]: value
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const prefs = profile?.notificationPreferences || {
    approvalAlerts: true,
    rewardMilestones: true,
    rewardClaimed: true,
    chatAlerts: true,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Notification Settings</h1>
        <p className="text-muted-foreground">Manage alerts for chore approvals and family communication.</p>
      </div>
      <Card>
          <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage alerts for chore approvals and reward notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                  <div className="space-y-0.5">
                      <Label htmlFor="approval-alerts" className="text-base">Approval Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                          Receive an instant notification when a chore is submitted for review.
                      </p>
                  </div>
                  <Switch 
                    id="approval-alerts" 
                    checked={prefs.approvalAlerts} 
                    onCheckedChange={(val) => updatePreference('approvalAlerts', val)}
                  />
              </div>
              <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                  <div className="space-y-0.5">
                      <Label htmlFor="reward-milestones" className="text-base">Reward Milestones</Label>
                        <p className="text-sm text-muted-foreground">
                          Get an alert when a champion has enough points to claim a reward.
                      </p>
                  </div>
                  <Switch 
                    id="reward-milestones" 
                    checked={prefs.rewardMilestones}
                    onCheckedChange={(val) => updatePreference('rewardMilestones', val)}
                  />
              </div>
              <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                  <div className="space-y-0.5">
                      <Label htmlFor="reward-claimed" className="text-base">Reward Claimed</Label>
                      <p className="text-sm text-muted-foreground">
                          Get an alert when a champion claims a reward.
                      </p>
                  </div>
                  <Switch 
                    id="reward-claimed" 
                    checked={prefs.rewardClaimed}
                    onCheckedChange={(val) => updatePreference('rewardClaimed', val)}
                  />
              </div>
              <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                  <div className="space-y-0.5">
                      <Label htmlFor="chat-alerts" className="text-base">Family Messages</Label>
                      <p className="text-sm text-muted-foreground">
                          Receive notifications for new messages in the family chat.
                      </p>
                  </div>
                  <Switch 
                    id="chat-alerts" 
                    checked={prefs.chatAlerts}
                    onCheckedChange={(val) => updatePreference('chatAlerts', val)}
                  />
              </div>
          </CardContent>
      </Card>
    </div>
  );
}
