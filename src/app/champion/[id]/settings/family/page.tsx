'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ChampionFamilySettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Family Settings</h1>
        <p className="text-muted-foreground">View your family members.</p>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Your Family</CardTitle>
            <CardDescription>Here are the members of your family group.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">Admins (Parents/Guardians)</h3>
                <p className="text-sm text-muted-foreground mb-4">These are the people who manage chores and rewards.</p>
                {/* In a real app, you'd list the admins here */}
            </div>
            <div className="p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">Champions (Kids)</h3>
                <p className="text-sm text-muted-foreground mb-4">Your fellow champions!</p>
                {/* In a real app, you'd list the other champions here */}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
