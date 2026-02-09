import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ListTodo, Star, Users, CalendarCheck } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Good Morning, Parent!</h1>
        <p className="text-muted-foreground">Here's a quick look at your family's chore progress.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chores for Today</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">2 completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Points Awarded</CardTitle>
            <Star className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">850</div>
            <p className="text-xs text-muted-foreground">+120 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Champions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Alex, Bella, Charlie</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Big Tasks</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Clean garage, Wash windows</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Champion Leaderboard</CardTitle>
            <CardDescription>Who's earning the most points this week?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <span>🥇 Alex</span>
                <div className="ml-auto font-bold">400 pts</div>
              </div>
              <div className="flex items-center">
                <span>🥈 Bella</span>
                <div className="ml-auto font-bold">320 pts</div>
              </div>
              <div className="flex items-center">
                <span>🥉 Charlie</span>
                <div className="ml-auto font-bold">130 pts</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Chores that need to be done today.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Checkbox id="chore-1" className="mt-1" />
                <div className="grid gap-0.5">
                  <label htmlFor="chore-1" className="font-medium">Feed the dog</label>
                  <p className="text-muted-foreground text-sm">Assigned to Alex</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox id="chore-2" className="mt-1" defaultChecked />
                <div className="grid gap-0.5">
                  <label htmlFor="chore-2" className="font-medium line-through">Wash dishes</label>
                  <p className="text-muted-foreground text-sm">Assigned to Bella</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox id="chore-3" className="mt-1" />
                <div className="grid gap-0.5">
                  <label htmlFor="chore-3" className="font-medium">Take out trash</label>
                  <p className="text-muted-foreground text-sm">Assigned to Charlie</p>
                </div>
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
