import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddChampionDialog } from "./AddChampionDialog";
import { PlaceHolderImages } from "@/lib/placeholder-images";


// Mock data for champions
const champions = [
  {
    id: "alex",
    name: "Alex",
    avatarId: "champion-alex",
    points: 125,
    choresCompleted: 12,
  },
  {
    id: "bella",
    name: "Bella",
    avatarId: "champion-bella",
    points: 85,
    choresCompleted: 8,
  },
];

export default function ChampionsPage() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Champions</CardTitle>
          <CardDescription>
            Manage your champions and view their progress.
          </CardDescription>
        </div>
        <AddChampionDialog />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Avatar</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Points</TableHead>
              <TableHead className="hidden md:table-cell">Chores Completed</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {champions.length > 0 ? (
              champions.map((champion) => {
                const championAvatar = PlaceHolderImages.find(p => p.id === champion.avatarId);
                return (
                <TableRow key={champion.id}>
                  <TableCell className="hidden sm:table-cell">
                     <Avatar className="h-12 w-12 border">
                        {championAvatar && <AvatarImage asChild src={championAvatar.imageUrl}><Image src={championAvatar.imageUrl} width={48} height={48} alt={champion.name} data-ai-hint={championAvatar.imageHint} /></AvatarImage>}
                        <AvatarFallback>{champion.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{champion.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">Active</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{champion.points}</TableCell>
                   <TableCell className="hidden md:table-cell">{champion.choresCompleted}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )})
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No champions added yet. Start by adding a champion.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
