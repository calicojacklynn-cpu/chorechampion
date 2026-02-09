import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddChoreDialog } from "./AddChoreDialog";

export default function ChoresPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Chore Management</h1>
          <p className="text-muted-foreground">Organize and assign chores for your champions.</p>
        </div>
        <AddChoreDialog />
      </div>

      <Tabs defaultValue="library">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="library">Chore Library</TabsTrigger>
          <TabsTrigger value="assigned">Assigned</TabsTrigger>
          <TabsTrigger value="custom">My Chores</TabsTrigger>
        </TabsList>

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

        <TabsContent value="library" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Chore Presets</CardTitle>
              <CardDescription>Quickly add common chores to your list.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-48">
              <p className="text-muted-foreground">No preset chores available.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
