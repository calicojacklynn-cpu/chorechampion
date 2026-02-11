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
import { Check, UserPlus } from "lucide-react";

export default function SubscriptionSettingsPage() {
  const currentPlan = "Free"; // Mock state
  const childSlots = 3; // Mock data
  const maxSlots = 3; // Mock data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Subscription Settings</h1>
        <p className="text-muted-foreground">The Treasury. Manage your Chore Champion subscription.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Plan Card */}
        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle>Your Current Plan</CardTitle>
                <CardDescription>You are on the <span className="font-bold text-primary">{currentPlan} Plan</span>.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-sm text-muted-foreground">
                    <p>Child Slots: {childSlots} / {maxSlots}</p>
                </div>
            </CardContent>
            <CardFooter>
                 <Button variant="outline" className="w-full" disabled>Current Plan</Button>
            </CardFooter>
        </Card>

        {/* Upgrade to Premium Card */}
        <Card className="lg:col-span-1 border-primary">
            <CardHeader>
                <CardTitle>Chore Champion Premium</CardTitle>
                 <CardDescription>Unlock more features and support the app!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex items-baseline">
                    <span className="text-4xl font-bold">$4.99</span>
                    <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        Up to 5 child slots
                    </li>
                     <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        All current features
                    </li>
                </ul>
            </CardContent>
             <CardFooter>
                <Button className="w-full">Upgrade to Premium</Button>
            </CardFooter>
        </Card>
        
        {/* Add more slots card */}
        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle>Need More Slots?</CardTitle>
                 <CardDescription>Add individual champion slots to your plan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex items-baseline">
                    <span className="text-4xl font-bold">$0.75</span>
                    <span className="text-muted-foreground">/slot</span>
                </div>
                <p className="text-sm text-muted-foreground">
                    Purchase additional slots one by one. Only available after upgrading to Premium.
                </p>
            </CardContent>
             <CardFooter>
                <Button className="w-full" variant="secondary" disabled={currentPlan !== 'Premium'}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Purchase Slot
                </Button>
            </CardFooter>
        </Card>

      </div>

      <Card>
          <CardHeader>
              <CardTitle>Billing Management</CardTitle>
              <CardDescription>Manage your payment method and view transaction history.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
              <Button variant="outline">Manage Billing</Button>
              <Button variant="outline">View History</Button>
          </CardContent>
      </Card>
    </div>
  );
}
