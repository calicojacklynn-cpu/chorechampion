
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTheme } from "@/app/context/ThemeContext";
import { themes } from "@/lib/themes";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ChampionThemesSettingsPage() {
  const { theme, setTheme } = useTheme();

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
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Choose a theme that you like! This only changes the theme for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {themes.map((t) => (
              <div key={t.name} className="space-y-2">
                <button
                  onClick={() => setTheme(t.className)}
                  className={cn(
                    "w-full rounded-lg border-2 p-1 transition-all",
                     theme === t.className ? "border-primary" : "border-transparent hover:border-primary/50"
                  )}
                  aria-label={`Select ${t.name} theme`}
                  aria-pressed={theme === t.className}
                >
                  <div className="aspect-video w-full rounded-md"
                    style={{ background: t.gradient }}
                  />
                </button>
                <div className="flex items-center justify-center gap-2">
                   {theme === t.className && <Check className="h-4 w-4 text-primary" />}
                   <p className="text-sm font-medium text-center">{t.name}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
