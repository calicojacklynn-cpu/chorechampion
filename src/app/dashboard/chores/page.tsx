import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";

const presetChores = [
  { title: "Clean Room", points: 25, description: "Make bed, put away toys, and tidy up surfaces." },
  { title: "Wash Dishes", points: 15, description: "Wash, dry, and put away the dishes from one meal." },
  { title: "Take Out Trash", points: 10, description: "Empty all trash cans and take the bag outside." },
  { title: "Feed Pet", points: 5, description: "Provide food and fresh water for a pet." },
];

export default function ChoresPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Chore Management</h1>
          <p className="text-muted-foreground">Organize and assign chores for your champions.</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Chore
        </Button>
      </div>

      <Tabs defaultValue="library">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="library">Chore Library</TabsTrigger>
          <TabsTrigger value="assigned">Assigned</TabsTrigger>
          <TabsTrigger value="custom">My Chores</TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Chore Presets</CardTitle>
              <CardDescription>Quickly add common chores to your list.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {presetChores.map((chore) => (
                <Card key={chore.title} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg">{chore.title}</CardTitle>
                    <CardDescription className="font-bold text-primary">{chore.points} Points</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">{chore.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" className="w-full">Add Chore</Button>
                  </CardFooter>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assigned" className="mt-4">
           <Card>
            <CardHeader>
              <CardTitle>Assigned Chores</CardTitle>
              <CardDescription>What everyone is working on.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-48">
              <p className="text-muted-foreground">Assigned chores will be listed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="mt-4">
           <Card>
            <CardHeader>
              <CardTitle>Your Custom Chores</CardTitle>
              <CardDescription>Chores you've created.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-48">
              <p className="text-muted-foreground">Your custom-created chores will be listed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
