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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useRef } from 'react';
import { useSchedule } from '@/app/context/ScheduleContext';
import { Sparkles, Loader2, CheckCircle } from 'lucide-react';

export default function SchedulerPage() {
  const { toast } = useToast();
  const { setSchedule } = useSchedule();
  const [instructions, setInstructions] = useState('');

  const { run, output, running, error } = streamFlow(generateChoreSchedule);
  const prevRunning = useRef(false);

  // Effect to show toast on error
  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: error.message || 'Failed to generate schedule.',
      });
    }
  }, [error, toast]);

  // Effect to show toast on success
  useEffect(() => {
    // Only show toast when the run is finished.
    if (prevRunning.current && !running && output) {
      toast({
        title: 'Schedule Generated!',
        description: 'Your new chore schedule is ready to be reviewed and applied.',
      });
    }
    // Keep track of the previous running state.
    prevRunning.current = running;
  }, [running, output, toast]);

  const handleGenerateSchedule = () => {
    if (!instructions.trim()) {
      toast({
        variant: 'destructive',
        title: 'Input required.',
        description: 'Please provide some instructions for the scheduler.',
      });
      return;
    }
    const input: ChoreScheduleInput = { instructions };
    run(input);
  };

  const handleApplyToCalendar = () => {
    if (output?.schedule) {
      setSchedule(output.schedule);
      toast({
        title: 'Schedule Applied!',
        description: 'The generated schedule has been applied to the in-app calendar.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Nothing to Apply',
        description: 'Please generate a schedule first.',
      });
    }
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
            Use plain English to tell the AI what you need. Be as descriptive as possible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="instructions-input" className="sr-only">
              Chore instructions
            </Label>
            <Textarea
              id="instructions-input"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={8}
              placeholder="e.g., 'Create a weekly chore schedule for my two kids, Alex and Bella. Chores are: wash dishes, take out trash, and walk the dog. Alex is busy on Tuesdays and Bella is busy on Thursdays. Rotate chores daily.'"
              className="text-base"
              disabled={running}
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
              Here is the optimized chore schedule. You can review and apply it to
              your calendar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {running && !output && (
              <div className="flex justify-center items-center py-10 min-h-[200px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="ml-4 text-muted-foreground">The AI is thinking...</p>
              </div>
            )}
            {output?.schedule && output.schedule.length > 0 && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day</TableHead>
                      <TableHead>Champion</TableHead>
                      <TableHead>Chore</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {output.schedule.map((assignment, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{assignment.day}</TableCell>
                        <TableCell>{assignment.championName}</TableCell>
                        <TableCell>{assignment.choreName}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            {output && (!output.schedule || output.schedule.length === 0) && (
                 <div className="flex justify-center items-center py-10 min-h-[200px]">
                    <p className="text-muted-foreground">The AI couldn't generate a schedule from the instructions. Please try again with more details.</p>
                 </div>
            )}
          </CardContent>
          {output && output.schedule && output.schedule.length > 0 && (
            <CardFooter>
              <Button onClick={handleApplyToCalendar} disabled={running}>
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
