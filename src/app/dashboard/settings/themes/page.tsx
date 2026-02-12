'use client';

import { Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTheme } from "@/app/context/ThemeContext";

const themes = [
  { name: 'light', label: 'Default Light', gradient: 'linear-gradient(to bottom right, #f1f5f9, #dbeafe)' },
  { name: 'dark', label: 'Default Dark', gradient: 'linear-gradient(to bottom right, #1e293b, #334155)' },
  { name: 'slate', label: 'Slate', gradient: 'linear-gradient(to bottom right, #334155, #475569)' },
  { name: 'rose', label: 'Rose', gradient: 'linear-gradient(to bottom right, #fda4af, #f472b6)' },
  { name: 'ocean', label: 'Ocean', gradient: 'linear-gradient(to bottom right, #7dd3fc, #38bdf8)' },
  { name: 'sage', label: 'Sage', gradient: 'linear-gradient(to bottom right, #86efac, #4ade80)' },
  { name: 'candy', label: 'Candy', gradient: 'linear-gradient(to bottom right, #f0abfc, #e879f9)' },
  { name: 'sunset', label: 'Sunset', gradient: 'linear-gradient(to bottom right, #fb923c, #f97316)' },
] as const;


export default function ThemesPage() {
  const { theme: activeTheme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Themes</h1>
        <p className="text-muted-foreground">
          Customize the look and feel of your Chore Champion experience.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Select a Theme</CardTitle>
          <CardDescription>
            Choose a color scheme that best suits your family's style.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {themes.map((theme) => {
              const isActive = activeTheme === theme.name;
              return (
                <div
                  key={theme.name}
                  className="space-y-2 cursor-pointer"
                  onClick={() => setTheme(theme.name)}
                >
                  <div
                    className={cn(
                      "rounded-lg border-2 p-1 transition-all",
                      isActive ? "border-primary" : "border-transparent"
                    )}
                  >
                    <div
                      className="h-20 w-full rounded-md"
                      style={{ background: theme.gradient }}
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2">
                     <span className="text-sm font-medium">{theme.label}</span>
                     {isActive && <Check className="h-4 w-4 text-primary" />}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
