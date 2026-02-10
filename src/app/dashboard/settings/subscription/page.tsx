'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SubscriptionSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Subscription Settings</h1>
        <p className="text-muted-foreground">The Treasury. Manage your Chore Champion Premium subscription.</p>
      </div>
      <Card>
          <CardHeader>
              <CardTitle>The Treasury</CardTitle>
              <CardDescription>Manage your Chore Champion Premium subscription.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="p-4 rounded-lg border">
                  <h3 className="font-semibold mb-2">Subscription Tier</h3>
                  <p className="text-sm text-muted-foreground">You are currently on the <span className="font-bold text-primary">Chore Champion Premium</span> plan.</p>
                  <p className="text-sm text-muted-foreground">This includes unlimited champions and advanced statistical tracking.</p>
              </div>
                <div className="p-4 rounded-lg border">
                  <h3 className="font-semibold mb-2">Billing Management</h3>
                  <p className="text-sm text-muted-foreground mb-4">Securely manage the payment method used for your subscription.</p>
                  <Button variant="outline">Manage Billing</Button>
              </div>
              <div className="p-4 rounded-lg border">
                  <h3 className="font-semibold mb-2">Transaction History</h3>
                  <p className="text-sm text-muted-foreground mb-4">View a clear record of subscription renewals and billing dates.</p>
                  <Button variant="outline">View History</Button>
              </div>
          </CardContent>
      </Card>
    </div>
  );
}
