'use client';

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

export default function ChampionNotificationSettingsPage() {
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
                  <Switch id="new-quest-alert" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                  <div className="space-y-0.5">
                      <Label htmlFor="quest-approved-alert" className="text-base">Quest Approved</Label>
                        <p className="text-sm text-muted-foreground">
                          Get an alert when your parent approves a completed quest and awards points.
                      </p>
                  </div>
                  <Switch id="quest-approved-alert" defaultChecked />
              </div>
               <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                  <div className="space-y-0.5">
                      <Label htmlFor="reward-milestone-alert" className="text-base">Reward Milestones</Label>
                        <p className="text-sm text-muted-foreground">
                          Get an alert when you have enough points to claim a new reward.
                      </p>
                  </div>
                  <Switch id="reward-milestone-alert" />
              </div>
          </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button>Save Preferences</Button>
          </CardFooter>
      </Card>
    </div>
  );
}
