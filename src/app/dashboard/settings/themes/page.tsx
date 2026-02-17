
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
  { name: 'sky', label: 'Sky Blue', gradient: 'linear-gradient(to bottom right, hsl(190, 100%, 90%), hsl(200, 100%, 92%), hsl(210, 100%, 94%))' },
  { name: 'forest', label: 'Forest', gradient: 'linear-gradient(to bottom right, hsl(140, 30%, 35%), hsl(160, 35%, 30%), hsl(180, 30%, 33%))' },
  { name: 'slate', label: 'Slate', gradient: 'linear-gradient(to bottom right, hsl(220, 13%, 18%), hsl(215, 25%, 27%), hsl(210, 30%, 20%))' },
  { name: 'rose', label: 'Rose', gradient: 'linear-gradient(to bottom right, hsl(335, 90%, 85%), hsl(350, 100%, 88%), hsl(5, 100%, 87%))' },
  { name: 'ocean', label: 'Ocean', gradient: 'linear-gradient(to bottom right, hsl(210, 60%, 15%), hsl(190, 70%, 25%), hsl(180, 50%, 15%))' },
  { name: 'sage', label: 'Sage', gradient: 'linear-gradient(to bottom right, hsl(115, 25%, 65%), hsl(110, 25%, 45%), hsl(105, 25%, 60%))' },
  { name: 'candy', label: 'Candy', gradient: 'linear-gradient(to bottom right, hsl(320, 100%, 80%), hsl(290, 100%, 80%), hsl(270, 100%, 80%))' },
  { name: 'sunset', label: 'Sunset', gradient: 'linear-gradient(to bottom right, hsl(50, 100%, 60%), hsl(30, 100%, 55%), hsl(10, 90%, 50%))' },
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
