'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ChampionSubscriptionSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Subscription</h1>
        <p className="text-muted-foreground">View your family's subscription details.</p>
      </div>
      <Card>
          <CardHeader>
              <CardTitle>Plan Details</CardTitle>
              <CardDescription>Subscription and billing are managed by your parent or guardian.</CardDescription>
          </CardHeader>
          <CardContent>
              <p className="text-sm text-muted-foreground">If you have questions about the subscription, please talk to your parent.</p>
          </CardContent>
      </Card>
    </div>
  );
}
