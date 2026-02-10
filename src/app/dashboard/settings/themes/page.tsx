'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ThemesSettingsPage() {
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
            Customize the look and feel of your app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Theme selection options will go here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
