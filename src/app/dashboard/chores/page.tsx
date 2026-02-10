"use client";

import { useState } from "react";
import { Plus, Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { AddChoreDialog } from "./AddChoreDialog";
import { useToast } from "@/hooks/use-toast";
import { AssignChoreDialog } from "./AssignChoreDialog";
import { useSchedule } from "@/app/context/ScheduleContext";
import type { ChoreAssignment } from "@/ai";

export type Chore = {
  id: string;
  name: string;
  description?: string;
  points: number;
};

// Mock data for initial custom chores
const initialChores: Chore[] = [
  {
    id: "chore-1",
    name: "Water the plants",
    description: "Water all indoor and outdoor plants.",
    points: 5,
  },
  {
    id: "chore-2",
    name: "Set the dinner table",
    points: 3,
  },
];

// Mock data for preset chores
// In a real app, these could be fetched or dynamically generated based on usage.
const presetChores = [
  { name: "Take out the trash", points: 5 },
  { name: "Wash the dishes", points: 10 },
  { name: "Walk the dog", points: 8 },
  { name: "Clean your room", points: 15 },
  { name: "Feed the pets", points: 3 },
  { name: "Fold laundry", points: 7 },
];


export default function ChoresPage() {
  const { toast } = useToast();
  const [chores, setChores] = useState<Chore[]>(initialChores);
  const [choreToAssign, setChoreToAssign] = useState<Chore | null>(null);
  const { schedule, setSchedule } = useSchedule();

  const handleAddChore = (newChoreData: Omit<Chore, "id">) => {
    const newChore: Chore = {
      ...newChoreData,
      id: `chore-${Date.now()}`,
    };
    setChores([newChore, ...chores]);
  };

  const handleAddPreset = (preset: { name: string; points: number }) => {
    // Check if a chore with the same name already exists
    if (chores.some(chore => chore.name.toLowerCase() === preset.name.toLowerCase())) {
        toast({
            variant: "default",
            title: "Chore already exists",
            description: `"${preset.name}" is already in your chore library.`,
        });
        return;
    }
    
    const newChore: Chore = {
      ...preset,
      id: `chore-${Date.now()}`,
      description: "", // Presets don't have descriptions by default
    };
    setChores([newChore, ...chores]);
    toast({
        title: "Chore Added",
        description: `"${preset.name}" has been added to your library.`,
    });
  };

  const handleAssignChore = (newAssignments: ChoreAssignment[]) => {
    setSchedule([...schedule, ...newAssignments]);
    toast({
      title: "Chore Assigned!",
      description: `${newAssignments.length} new chore assignment(s) have been added to the calendar.`,
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Chore Management</h1>
            <p className="text-muted-foreground">Organize and assign chores for your champions.</p>
          </div>
          <AddChoreDialog onAdd={handleAddChore} />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* Main column for the chore library */}
          <div className="lg:col-span-2">
              <Card>
                  <CardHeader>
                      <CardTitle>Your Chore Library</CardTitle>
                      <CardDescription>A list of all available chores. Add new ones or pick from the presets.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                          <TableHeader>
                              <TableRow>
                                  <TableHead>Chore</TableHead>
                                  <TableHead className="hidden sm:table-cell">Description</TableHead>
                                  <TableHead className="text-center">Points</TableHead>
                                  <TableHead>
                                  <span className="sr-only">Actions</span>
                                  </TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {chores.length > 0 ? (
                                  chores.map((chore) => (
                                      <TableRow key={chore.id}>
                                          <TableCell className="font-medium">{chore.name}</TableCell>
                                          <TableCell className="hidden sm:table-cell text-muted-foreground truncate max-w-xs">
                                              {chore.description || "No description"}
                                          </TableCell>
                                          <TableCell className="text-center">
                                              <Badge variant="secondary" className="w-fit">
                                                  <Star className="w-3 h-3 mr-1 text-accent fill-accent" />
                                                  {chore.points}
                                              </Badge>
                                          </TableCell>
                                          <TableCell>
                                              <DropdownMenu>
                                              <DropdownMenuTrigger asChild>
                                                  <Button aria-haspopup="true" size="icon" variant="ghost">
                                                      <MoreHorizontal className="h-4 w-4" />
                                                      <span className="sr-only">Toggle menu</span>
                                                  </Button>
                                              </DropdownMenuTrigger>
                                              <DropdownMenuContent align="end">
                                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                  <DropdownMenuItem onSelect={() => setChoreToAssign(chore)}>Assign</DropdownMenuItem>
                                                  <DropdownMenuItem>Edit</DropdownMenuItem>
                                                  <DropdownMenuItem>Delete</DropdownMenuItem>
                                              </DropdownMenuContent>
                                              </DropdownMenu>
                                          </TableCell>
                                      </TableRow>
                                  ))
                              ) : (
                                  <TableRow>
                                      <TableCell colSpan={4} className="h-24 text-center">
                                          No chores yet. Add a chore or pick from the presets.
                                      </TableCell>
                                  </TableRow>
                              )}
                          </TableBody>
                      </Table>
                  </CardContent>
              </Card>
          </div>

          {/* Side column for presets */}
          <div className="lg:col-span-1">
              <Card>
                  <CardHeader>
                      <CardTitle>Quick Add Presets</CardTitle>
                      <CardDescription>Add common chores to your library with one click.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                      {presetChores.map((preset) => (
                          <Button key={preset.name} variant="outline" size="sm" onClick={() => handleAddPreset(preset)}>
                              <Plus className="mr-2 h-4 w-4" />
                              {preset.name}
                          </Button>
                      ))}
                  </CardContent>
              </Card>
          </div>

        </div>
      </div>
      <AssignChoreDialog
        chore={choreToAssign}
        isOpen={!!choreToAssign}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setChoreToAssign(null);
          }
        }}
        onAssign={handleAssignChore}
      />
    </>
  );
}
