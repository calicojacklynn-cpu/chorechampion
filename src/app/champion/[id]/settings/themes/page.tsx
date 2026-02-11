'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ChampionThemesSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Theme Settings</h1>
        <p className="text-muted-foreground">
          Customize the look and feel of your app.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Themes</CardTitle>
          <CardDescription>
            Choose a theme that you like! This only changes the theme for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Theme selection options will go here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
