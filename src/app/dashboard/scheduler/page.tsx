'use client';

import { useFlow } from '@genkit-ai/next/client';
import {
  generateAutomatedChoreSchedule,
  type AutomatedChoreScheduleInput,
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
  const [championAvailability, setChampionAvailability] = useState(
    JSON.stringify(
      [
        { championName: 'Alex', availableDays: ['Monday', 'Wednesday', 'Friday'] },
        { championName: 'Bella', availableDays: ['Tuesday', 'Thursday', 'Saturday'] },
      ],
      null,
      2
    )
  );
  const [choreList, setChoreList] = useState(
    JSON.stringify(
      [
        { choreName: 'Wash dishes', frequency: 'daily' },
        { choreName: 'Take out trash', frequency: 'twice a week' },
        { choreName: 'Vacuum living room', frequency: 'weekly' },
      ],
      null,
      2
    )
  );
  const [houseDetails, setHouseDetails] = useState(
    'We have 2 bathrooms that need cleaning weekly. The kids get home from school around 4pm.'
  );

  const { run, output, running, error } = useFlow(generateAutomatedChoreSchedule);

  if (error) {
    toast({
      variant: 'destructive',
      title: 'An error occurred.',
      description: error.message || 'Failed to generate schedule.',
    });
  }

  const handleGenerateSchedule = () => {
    let input: AutomatedChoreScheduleInput;
    try {
      input = {
        championAvailability: JSON.parse(championAvailability),
        choreList: JSON.parse(choreList),
        houseDetails: houseDetails,
      };
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: 'Invalid JSON format.',
        description: 'Please check the format of your Champion Availability and Chore List inputs.',
      });
      return;
    }
    run(input);
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
        <Button
          onClick={handleGenerateSchedule}
          disabled={running}
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
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Inputs</CardTitle>
            <CardDescription>
              Provide the data to generate a schedule from. Use JSON format for availability and chores.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="champion-availability">Champion Availability</Label>
              <Textarea
                id="champion-availability"
                value={championAvailability}
                onChange={(e) => setChampionAvailability(e.target.value)}
                rows={10}
                placeholder="Enter champion availability as JSON"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chore-list">Chore List</Label>
              <Textarea
                id="chore-list"
                value={choreList}
                onChange={(e) => setChoreList(e.target.value)}
                rows={10}
                placeholder="Enter chore list as JSON"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="house-details">House Details</Label>
              <Textarea
                id="house-details"
                value={houseDetails}
                onChange={(e) => setHouseDetails(e.target.value)}
                rows={5}
                placeholder="Describe your house and any other relevant details."
              />
            </div>
          </CardContent>
        </Card>
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
            ) : (
              !running && (
                <div className="text-center py-10 min-h-[200px] flex flex-col items-center justify-center text-muted-foreground">
                  <p>Click "Generate Schedule" to create a new chore plan.</p>
                </div>
              )
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
    </div>
  );
}
