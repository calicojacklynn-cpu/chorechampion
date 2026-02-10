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
import { Sparkles, Loader2, CheckCircle, Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// This is a browser-only API, so we declare the type here.
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function SchedulerPage() {
  const { toast } = useToast();
  const [instructions, setInstructions] = useState(
    'Create a weekly chore schedule for my two kids, Alex and Bella. Alex is available Monday and Wednesday. Bella is available Tuesday and Thursday. Chores are: take out trash (daily), wash dishes (daily), and clean room (weekly).'
  );
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        toast({
          variant: 'destructive',
          title: 'Voice Recognition Error',
          description: event.error,
        });
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInstructions((prev) =>
          (prev ? `${prev.trim()} ${transcript}` : transcript).trim()
        );
      };

      recognitionRef.current = recognition;
    } else {
      setIsSpeechSupported(false);
    }
  }, [toast]);

  const toggleListening = () => {
    if (!isSpeechSupported) {
      toast({
        variant: 'destructive',
        title: 'Unsupported Feature',
        description: 'Voice recognition is not supported in your browser.',
      });
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

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
    const input: ChoreScheduleInput = { instructions };
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
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
          <CardDescription>
            Use plain English to tell the AI what you need. You can type or use
            your voice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="instructions-input" className="font-bold text-lg">
              What can I do for you today?
            </Label>
            <div className="relative">
              <Textarea
                id="instructions-input"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={8}
                placeholder="e.g., 'Create a weekly chore schedule for my two kids, Alex and Bella...'"
                className="text-base pr-12"
              />
              {isSpeechSupported && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={toggleListening}
                  className="absolute bottom-2 right-2 text-muted-foreground hover:text-foreground"
                >
                  {isListening ? (
                    <MicOff className="h-5 w-5 text-destructive" />
                  ) : (
                    <Mic className="h-5 w-5" />
                  )}
                  <span className="sr-only">
                    {isListening ? 'Stop Listening' : 'Use Voice'}
                  </span>
                </Button>
              )}
            </div>
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
              Here is an optimized chore schedule. You can review and apply it to
              your calendar.
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
