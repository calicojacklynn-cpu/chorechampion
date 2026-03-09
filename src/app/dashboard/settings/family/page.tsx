
'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function FamilySettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Family Settings</h1>
        <p className="text-muted-foreground">Manage your family roster and administrators.</p>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Family Roster</CardTitle>
            <CardDescription>Manage the "Adventurers" and the "Gamemasters."</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">Admin Profiles</h3>
                <p className="text-sm text-muted-foreground mb-4">Manage parent or guardian accounts with family admin privileges.</p>
                <Button asChild>
                    <Link href="/dashboard/settings/family/admins">Manage Admins</Link>
                </Button>
            </div>
            <div className="p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">Adventurer Profiles</h3>
                <p className="text-sm text-muted-foreground mb-4">Customize profiles and login codes for your family's adventurers.</p>
                <Button asChild>
                    <Link href="/dashboard/settings/family/champions">Manage Adventurers</Link>
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
