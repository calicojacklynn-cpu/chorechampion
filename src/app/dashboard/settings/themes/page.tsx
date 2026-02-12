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
  { name: 'light', label: 'Default Light', colors: ['#f8fafc', '#ffffff', '#60a5fa'] },
  { name: 'dark', label: 'Default Dark', colors: ['#1e293b', '#334155', '#38bdf8'] },
  { name: 'slate', label: 'Slate', colors: ['#292d3e', '#3a415a', '#a6accd'] },
  { name: 'rose', label: 'Rose', colors: ['#fff1f2', '#ffffff', '#f43f5e'] },
  { name: 'ocean', label: 'Ocean', colors: ['#0f172a', '#1e293b', '#06b6d4'] },
  { name: 'sage', label: 'Sage', colors: ['#f0fdf4', '#ffffff', '#22c55e'] },
  { name: 'candy', label: 'Candy', colors: ['#faf5ff', '#ffffff', '#ec4899'] },
  { name: 'sunset', label: 'Sunset', colors: ['#281e19', '#412d25', '#f97316'] },
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
                    <div className="flex items-center gap-2 rounded-md p-2 bg-[var(--preview-bg)]" style={{'--preview-bg': theme.colors[0]} as React.CSSProperties}>
                      <div className="w-10 h-16 rounded-md bg-[var(--preview-card)]" style={{'--preview-card': theme.colors[1]} as React.CSSProperties} />
                      <div className="flex-1 space-y-1.5">
                        <div className="w-full h-2.5 rounded-sm bg-[var(--preview-primary)]" style={{'--preview-primary': theme.colors[2]} as React.CSSProperties}/>
                        <div className="w-4/5 h-2.5 rounded-sm bg-[var(--preview-primary)] opacity-50" style={{'--preview-primary': theme.colors[2]} as React.CSSProperties}/>
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
