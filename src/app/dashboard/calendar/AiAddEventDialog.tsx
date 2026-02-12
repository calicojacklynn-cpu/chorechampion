
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { SpeechToTextInput } from "@/app/components/SpeechToTextInput";
import { useToast } from "@/hooks/use-toast";
import { useSchedule } from "@/app/context/ScheduleContext";
import { aiCreateEvents, type AiCreateEventsInput } from "@/ai";

export function AiAddEventDialog() {
  const { toast } = useToast();
  const { addEvent } = useSchedule();
  const [open, setOpen] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [isAiRunning, setIsAiRunning] = useState(false);

  async function handleSubmit() {
    if (!instructions.trim()) {
      toast({
        variant: "destructive",
        title: "Instructions required",
        description: "Please tell the AI what events to create.",
      });
      return;
    }

    setIsAiRunning(true);
    try {
      const input: AiCreateEventsInput = {
        instructions,
        currentDate: format(new Date(), "yyyy-MM-dd"),
      };

      const result = await aiCreateEvents(input);

      if (result.events && result.events.length > 0) {
        result.events.forEach(eventData => {
          addEvent(eventData);
        });

        toast({
          title: "AI Events Added!",
          description: `${result.events.length} event(s) have been added to your calendar.`,
        });
        setOpen(false);
        setInstructions("");
      } else {
        throw new Error("The AI couldn't create any events. Please try rewriting your instructions.");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "AI Scheduling Failed",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsAiRunning(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <Sparkles className="mr-2 h-4 w-4" />
          AI Add Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>AI Add Events</DialogTitle>
          <DialogDescription>
            Use natural language to add single or recurring events. The AI understands end dates, like "School weekdays 8am-3pm until June 1st."
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="ai-instructions">Instructions</Label>
            <SpeechToTextInput
              id="ai-instructions"
              placeholder="e.g., School for Alex and Bella every weekday from 8:30am to 3:00pm"
              rows={4}
              value={instructions}
              onChange={setInstructions}
              disabled={isAiRunning}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="default" onClick={handleSubmit} disabled={isAiRunning} className="w-full">
            {isAiRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Events...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Add to Calendar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
