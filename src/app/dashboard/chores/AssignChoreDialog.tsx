'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Loader2, Wand2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { SpeechToTextInput } from '@/app/components/SpeechToTextInput';
import { useToast } from '@/hooks/use-toast';
import { useSchedule } from '@/app/context/ScheduleContext';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Chore } from './page';
import type { ChoreAssignment } from '@/ai';
import { aiScheduleChore, type AiScheduleChoreInput } from '@/ai';
import type { Champion } from '../champions/page';

const FormSchema = z.object({
  championIds: z.array(z.string()).refine((value) => value.length > 0, {
    message: 'You have to select at least one champion.',
  }),
  constraints: z.string().optional(),
});

type AssignChoreDialogProps = {
  chore: Chore | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAssign: (assignments: ChoreAssignment[], championIds: string[]) => void;
};

export function AssignChoreDialog({
  chore,
  isOpen,
  onOpenChange,
  onAssign,
}: AssignChoreDialogProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const { schedule, events } = useSchedule();
  const [isAiRunning, setIsAiRunning] = useState(false);

  const championsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'champions'), where('parentId', '==', user.uid));
  }, [firestore, user]);

  const { data: champions, isLoading: isLoadingChampions } = useCollection<Champion>(championsQuery);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      championIds: [],
      constraints: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({ championIds: [], constraints: '' });
      setIsAiRunning(false);
    }
  }, [isOpen, form]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!chore || !champions) return;

    setIsAiRunning(true);
    try {
      const selectedChampions = champions.filter(c => data.championIds.includes(c.id));
      const clientEvents = events || [];
      const aiEvents = clientEvents.map(({ id, ...rest }) => rest);

      const input: AiScheduleChoreInput = {
        choreName: chore.name,
        championNames: selectedChampions.map(c => c.name),
        existingSchedule: schedule,
        calendarEvents: aiEvents,
        constraints: data.constraints,
        currentDate: format(new Date(), 'yyyy-MM-dd'),
      };

      const result = await aiScheduleChore(input);

      if (result.assignments && result.assignments.length > 0) {
        onAssign(result.assignments, data.championIds);
        toast({
          title: 'AI Scheduled!',
          description: `"${chore.name}" has been added to the calendar and assigned.`,
        });
        onOpenChange(false);
      } else {
        throw new Error("The AI couldn't find a suitable time. Try adjusting constraints or adding champions.");
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'AI Scheduling Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsAiRunning(false);
    }
  }

  if (!chore) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI Schedule: {chore.name}</DialogTitle>
          <DialogDescription>
            Let AI find the best time to schedule this chore for your champions.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="championIds"
              render={() => (
                <FormItem>
                  <FormLabel className="text-base">Champions</FormLabel>
                  <FormDescription>
                    Select the champion(s) to assign this chore to.
                  </FormDescription>
                  <div className="space-y-2 pt-2">
                    {isLoadingChampions ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading champions...
                      </div>
                    ) : champions && champions.length > 0 ? (
                      champions.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="championIds"
                          render={({ field }) => (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    const currentIds = field.value || [];
                                    const newIds = checked
                                      ? [...currentIds, item.id]
                                      : currentIds.filter(value => value !== item.id);
                                    field.onChange(newIds);
                                  }}
                                  disabled={isAiRunning}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.name}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No champions found. Add them in Settings.</p>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="constraints"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Constraints (Optional)</FormLabel>
                  <FormControl>
                    <SpeechToTextInput
                      placeholder="e.g., 'after 4pm', 'on a weekday', 'not on Tuesday'"
                      disabled={isAiRunning}
                      value={field.value || ''}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Give the AI hints to find the perfect time slot.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isAiRunning || !champions?.length} className="w-full">
                {isAiRunning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    AI Schedule Chore
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
