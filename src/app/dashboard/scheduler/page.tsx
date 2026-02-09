'use client';

import { streamFlow } from '@genkit-ai/next/client';
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
  const [naturalLanguageInstructions, setNaturalLanguageInstructions] = useState(
    'Billy takes out the trash every night at 8pm. The dog needs to be walked by either champion in the morning and evening.'
  );
  const [championAvailability, setChampionAvailability] = useState('');
  const [choreList, setChoreList] = useState('');
  const [houseDetails, setHouseDetails] = useState(
    'We have 2 bathrooms that need cleaning weekly. The kids get home from school around 4pm.'
  );

  const { run, output, running, error } = streamFlow(generateAutomatedChoreSchedule);

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
      const championData = championAvailability ? JSON.parse(championAvailability) : [];
      const choreData = choreList ? JSON.parse(choreList) : [];

      input = {
        naturalLanguageInstructions,
        championAvailability: championData,
        choreList: choreData,
        houseDetails,
      };
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: 'Invalid JSON format.',
        description:
          'Please check the format of your Champion Availability and Chore List inputs if you are using them.',
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
            Let AI optimize your family's chore schedule for you. Use plain English or
            structured JSON.
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
              Provide instructions for the schedule. Specific instructions in English are
              prioritized.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="natural-language-instructions">Specific Instructions</Label>
              <Textarea
                id="natural-language-instructions"
                value={naturalLanguageInstructions}
                onChange={(e) => setNaturalLanguageInstructions(e.target.value)}
                rows={5}
                placeholder="e.g., 'Billy takes out the trash every night at 8pm.'"
              />
              <p className="text-sm text-muted-foreground">
                This is the primary input. Use plain English to give specific instructions.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="champion-availability">Champion Availability (JSON)</Label>
              <Textarea
                id="champion-availability"
                value={championAvailability}
                onChange={(e) => setChampionAvailability(e.target.value)}
                rows={10}
                placeholder='e.g., [{ "championName": "Alex", "availableDays": ["Monday", "Friday"] }]'
              />
              <p className="text-sm text-muted-foreground">
                Optional: Provide general availability if not covered by specific instructions.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="chore-list">Chore List (JSON)</Label>
              <Textarea
                id="chore-list"
                value={choreList}
                onChange={(e) => setChoreList(e.target.value)}
                rows={10}
                placeholder='e.g., [{ "choreName": "Wash dishes", "frequency": "daily" }]'
              />
              <p className="text-sm text-muted-foreground">
                Optional: Provide a general list of chores if not covered by specific
                instructions.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="house-details">General House Details</Label>
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
