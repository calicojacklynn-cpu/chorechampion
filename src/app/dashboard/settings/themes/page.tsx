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
  { name: 'light', label: 'Default Light', gradient: 'linear-gradient(to bottom right, #FFFFFF, #f1f5f9)', card: '#ffffff', primary: '#3b82f6' },
  { name: 'dark', label: 'Default Dark', gradient: 'linear-gradient(to bottom right, #0f172a, #020617)', card: '#1e293b', primary: '#38bdf8' },
  { name: 'slate', label: 'Slate', gradient: 'linear-gradient(to bottom right, #1e293b, #0f172a)', card: '#292d3e', primary: '#a6accd' },
  { name: 'rose', label: 'Rose', gradient: 'linear-gradient(to bottom right, #fff1f2, #ffe4e6)', card: '#ffffff', primary: '#f43f5e' },
  { name: 'ocean', label: 'Ocean', gradient: 'linear-gradient(to bottom right, #0f172a, #083344)', card: '#1e293b', primary: '#06b6d4' },
  { name: 'sage', label: 'Sage', gradient: 'linear-gradient(to bottom right, #f0fdf4, #dcfce7)', card: '#ffffff', primary: '#22c55e' },
  { name: 'candy', label: 'Candy', gradient: 'linear-gradient(to bottom right, #fdf4ff, #fae8ff)', card: '#ffffff', primary: '#ec4899' },
  { name: 'sunset', label: 'Sunset', gradient: 'linear-gradient(to bottom right, #78350f, #450a0a)', card: '#412d25', primary: '#f97316' },
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
                      "rounded-md border-2 p-1 transition-all",
                      isActive ? "border-primary" : "border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-2 rounded-md p-2" style={{background: theme.gradient}}>
                      <div className="w-10 h-16 rounded-md" style={{backgroundColor: theme.card}}/>
                      <div className="flex-1 space-y-1.5">
                        <div className="w-full h-2.5 rounded-sm" style={{backgroundColor: theme.primary}}/>
                        <div className="w-4/5 h-2.5 rounded-sm opacity-50" style={{backgroundColor: theme.primary}}/>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
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
