import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const champions = [
  { id: 'champion-alex', name: 'Alex', points: 1250, choresCompleted: 42, fallback: 'AL' },
  { id: 'champion-bella', name: 'Bella', points: 980, choresCompleted: 35, fallback: 'BE' },
  { id: 'champion-charlie', name: 'Charlie', points: 730, choresCompleted: 28, fallback: 'CH' },
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
        <Button asChild size="sm" className="ml-auto gap-1 bg-accent hover:bg-accent/90 text-accent-foreground">
          <a href="#">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Champion
            </span>
          </a>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Avatar</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Total Points</TableHead>
              <TableHead className="hidden md:table-cell">Chores Completed</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {champions.map((champion) => {
              const championImage = PlaceHolderImages.find(p => p.id === champion.id);
              return (
                <TableRow key={champion.name}>
                  <TableCell className="hidden sm:table-cell">
                    <Avatar className="h-10 w-10">
                      {championImage && <AvatarImage asChild src={championImage.imageUrl} alt={`${champion.name}'s avatar`}><Image src={championImage.imageUrl} alt={championImage.description} data-ai-hint={championImage.imageHint} width={40} height={40}/></AvatarImage>}
                      <AvatarFallback>{champion.fallback}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{champion.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{champion.points} pts</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{champion.choresCompleted}</TableCell>
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
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Chores</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
