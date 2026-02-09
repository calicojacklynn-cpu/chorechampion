'use client';

import { useFlow } from '@genkit-ai/next/client';
import { generateAutomatedChoreSchedule } from '@/ai/flows/automated-chore-schedule-generation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Sparkles, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SchedulerPage() {
  const { toast } = useToast();
  // Mock data for the flow input
  const mockInput = {
    championAvailability: [
      { championName: "Alex", availableDays: ["Monday", "Wednesday", "Friday", "Sunday"] },
      { championName: "Bella", availableDays: ["Tuesday", "Thursday", "Saturday", "Sunday"] },
      { championName: "Charlie", availableDays: ["Monday", "Wednesday", "Friday", "Saturday"] },
    ],
    choreList: [
      { choreName: "Take out trash", frequencyPerWeek: 3, estimatedTimeMinutes: 5 },
      { choreName: "Wash dishes", frequencyPerWeek: 7, estimatedTimeMinutes: 15 },
      { choreName: "Feed the dog", frequencyPerWeek: 14, estimatedTimeMinutes: 5 },
      { choreName: "Clean room", frequencyPerWeek: 2, estimatedTimeMinutes: 30 },
      { choreName: "Walk the dog", frequencyPerWeek: 7, estimatedTimeMinutes: 20 },
      { choreName: "Water plants", frequencyPerWeek: 3, estimatedTimeMinutes: 10 },
    ],
    houseDetails: "A 3-bedroom house with a dog. The family wants to ensure chores are distributed fairly and that the dog is fed twice a day and walked once a day. Chores can be done on any available day."
  };

  const { run, output, running, error } = useFlow(generateAutomatedChoreSchedule);

  if (error) {
    toast({
        variant: "destructive",
        title: "An error occurred.",
        description: error.message || "Failed to generate schedule.",
    });
  }

  const handleGenerateSchedule = () => {
    run(mockInput);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-accent" />
            AI Chore Scheduler
          </h1>
          <p className="text-muted-foreground">
            Let AI optimize your family's chore schedule for you.
          </p>
        </div>
        <Button onClick={handleGenerateSchedule} disabled={running} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          {running ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Schedule
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generated Schedule</CardTitle>
          <CardDescription>
            Here is an optimized chore schedule. You can review and apply it to your calendar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {running && (
            <div className="flex justify-center items-center py-10 min-h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          {output?.schedule ? (
            <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm">
              {JSON.stringify(output.schedule, null, 2)}
            </pre>
          ) : !running && (
            <div className="text-center py-10 min-h-[200px] flex flex-col items-center justify-center text-muted-foreground">
                <p>Click "Generate Schedule" to create a new chore plan.</p>
                <p className="text-xs mt-2">(Using mock data for demonstration)</p>
            </div>
          )}
        </CardContent>
        {output && (
            <CardFooter>
                <Button>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Apply to Calendar
                </Button>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}
