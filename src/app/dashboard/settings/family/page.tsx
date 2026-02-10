'use client';

import Link from "next/link";
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

export default function FamilySettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Family Settings</h1>
        <p className="text-muted-foreground">The Family Roster. Manage the "Players" and the "Gamemasters."</p>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>The Family Roster</CardTitle>
            <CardDescription>Manage the "Players" and the "Gamemasters."</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">Admin Profiles</h3>
                <p className="text-sm text-muted-foreground mb-4">Manage parent or guardian accounts with admin privileges.</p>
                <Button variant="outline">Manage Admins</Button>
            </div>
            <div className="p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">Child Profiles & Champion Identity</h3>
                <p className="text-sm text-muted-foreground mb-4">Customize usernames and "Hero" icons for your champions on the Champions page.</p>
                <Button asChild>
                    <Link href="/dashboard/champions">Manage Champions</Link>
                </Button>
            </div>
            <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                <div className="space-y-0.5">
                    <Label htmlFor="age-filters" className="text-base">Age-Appropriate Filters</Label>
                    <p className="text-sm text-muted-foreground">
                        Categorize chores by difficulty (e.g., "Level 1" vs. "Master Class").
                    </p>
                </div>
                <Switch id="age-filters" />
            </div>
        </CardContent>
            <CardFooter className="border-t px-6 py-4">
            <Button>Save Family Settings</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
