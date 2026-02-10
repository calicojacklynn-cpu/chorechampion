'use client';

import { streamFlow } from '@genkit-ai/next/client';
import {
  generateChoreSchedule,
  type ChoreScheduleInput,
} from '@/ai/flows/automated-chore-schedule-generation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Sparkles, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function SchedulerPage() {
  const { toast } = useToast();
  const [instructions, setInstructions] = useState(
    'Create a weekly chore schedule for my two kids, Alex and Bella. Alex is available Monday and Wednesday. Bella is available Tuesday and Thursday. Chores are: take out trash (daily), wash dishes (daily), and clean room (weekly).'
  );

  const { run, output, running, error } = streamFlow(generateChoreSchedule);

  if (error) {
    toast({
      variant: 'destructive',
      title: 'An error occurred.',
      description: error.message || 'Failed to generate schedule.',
    });
  }

  const handleGenerateSchedule = () => {
     if (!instructions) {
      toast({
        variant: 'destructive',
        title: 'Input required.',
        description: 'Please provide some instructions for the scheduler.',
      });
      return;
    }
    run({ instructions });
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
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
          <CardDescription>
            Use plain English to tell the AI what you need. It will handle the rest.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="instructions-input" className="font-bold text-lg">
              What can I do for you today?
            </Label>
            <Textarea
              id="instructions-input"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={8}
              placeholder="e.g., 'Create a weekly chore schedule for my two kids, Alex and Bella...'"
              className="text-base"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleGenerateSchedule}
            disabled={running}
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
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
        </CardFooter>
      </Card>

      {(running || output) && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Schedule</CardTitle>
            <CardDescription>
              Here is an optimized chore schedule. You can review and apply it to your calendar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {running && !output && (
              <div className="flex justify-center items-center py-10 min-h-[200px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}
            {output?.schedule && (
              <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm">
                {JSON.stringify(output.schedule, null, 2)}
              </pre>
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
      )}
    </div>
  );
}
