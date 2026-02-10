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

export default function NotificationSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Notification Settings</h1>
        <p className="text-muted-foreground">The "Nag" Filter. Manage how and when you receive alerts.</p>
      </div>
      <Card>
          <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>The "Nag" Filter. Manage how and when you receive alerts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                  <div className="space-y-0.5">
                      <Label htmlFor="approval-alerts" className="text-base">Approval Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                          Receive an instant notification when a chore is submitted for review.
                      </p>
                  </div>
                  <Switch id="approval-alerts" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                  <div className="space-y-0.5">
                      <Label htmlFor="reward-milestones" className="text-base">Reward Milestones</Label>
                        <p className="text-sm text-muted-foreground">
                          Get an alert when a champion has enough points to claim a reward.
                      </p>
                  </div>
                  <Switch id="reward-milestones" defaultChecked />
              </div>
                <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                  <div className="space-y-0.5">
                      <Label htmlFor="family-broadcasts" className="text-base">Family Broadcasts</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow admin messages to be sent to all champion devices.
                      </p>
                  </div>
                  <Switch id="family-broadcasts" />
              </div>
          </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button>Save Notification Settings</Button>
          </CardFooter>
      </Card>
    </div>
  );
}
