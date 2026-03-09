
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
import { useParams } from "next/navigation";

type ChampionProfile = {
  notificationPreferences?: {
    newQuestAlerts: boolean;
    questApprovedAlerts: boolean;
    rewardMilestoneAlerts: boolean;
    chatAlerts: boolean;
  };
};

export default function ChampionNotificationSettingsPage() {
  const params = useParams();
  const championId = typeof params.id === 'string' ? params.id : '';
  const firestore = useFirestore();

  const championDocRef = useMemoFirebase(() => {
    if (!firestore || !championId) return null;
    return doc(firestore, 'champions', championId);
  }, [firestore, championId]);

  const { data: profile, isLoading } = useDoc<ChampionProfile>(championDocRef);

  const updatePreference = (key: string, value: boolean) => {
    if (!championId || !firestore) return;
    const docRef = doc(firestore, 'champions', championId);
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
    newQuestAlerts: true,
    questApprovedAlerts: true,
    rewardMilestoneAlerts: false,
    chatAlerts: true,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Notification Settings</h1>
        <p className="text-muted-foreground">Manage how you receive alerts.</p>
      </div>
      <Card>
          <CardHeader>
              <CardTitle>Your Notifications</CardTitle>
              <CardDescription>Choose which alerts you want to receive.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                  <div className="space-y-0.5">
                      <Label htmlFor="new-quest-alert" className="text-base">New Quest Assigned</Label>
                      <p className="text-sm text-muted-foreground">
                          Get notified when a new quest is added to your list.
                      </p>
                  </div>
                  <Switch 
                    id="new-quest-alert" 
                    checked={prefs.newQuestAlerts}
                    onCheckedChange={(val) => updatePreference('newQuestAlerts', val)}
                  />
              </div>
              <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                  <div className="space-y-0.5">
                      <Label htmlFor="quest-approved-alert" className="text-base">Quest Approved</Label>
                        <p className="text-sm text-muted-foreground">
                          Get an alert when your parent approves a completed quest and awards points.
                      </p>
                  </div>
                  <Switch 
                    id="quest-approved-alert" 
                    checked={prefs.questApprovedAlerts}
                    onCheckedChange={(val) => updatePreference('questApprovedAlerts', val)}
                  />
              </div>
               <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                  <div className="space-y-0.5">
                      <Label htmlFor="reward-milestone-alert" className="text-base">Reward Milestones</Label>
                        <p className="text-sm text-muted-foreground">
                          Get an alert when you have enough points to claim a new reward.
                      </p>
                  </div>
                  <Switch 
                    id="reward-milestone-alert" 
                    checked={prefs.rewardMilestoneAlerts}
                    onCheckedChange={(val) => updatePreference('rewardMilestoneAlerts', val)}
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
