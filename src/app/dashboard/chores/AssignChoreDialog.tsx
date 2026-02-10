'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

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
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { Chore } from './page';
import type { ChoreAssignment } from '@/ai';

// Mock data for champions, should be fetched from a central store in a real app
const champions = [
  { id: 'alex', name: 'Alex' },
  { id: 'bella', name: 'Bella' },
];

const FormSchema = z.object({
  championIds: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one champion.',
  }),
  date: z.date({
    required_error: 'A date is required.',
  }),
});

type AssignChoreDialogProps = {
  chore: Chore | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAssign: (assignments: ChoreAssignment[]) => void;
};

export function AssignChoreDialog({
  chore,
  isOpen,
  onOpenChange,
  onAssign,
}: AssignChoreDialogProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      championIds: [],
      date: new Date(),
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({ championIds: [], date: new Date() });
    }
  }, [isOpen, form]);


  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!chore) return;

    const newAssignments: ChoreAssignment[] = data.championIds.map((championId) => {
      const champion = champions.find((c) => c.id === championId);
      return {
        day: format(data.date, 'EEEE'), // e.g., "Monday"
        championName: champion?.name || 'Unknown',
        choreName: chore.name,
      };
    });

    onAssign(newAssignments);
    onOpenChange(false);
    form.reset();
  }

  if (!chore) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Chore: {chore.name}</DialogTitle>
          <DialogDescription>
            Select champions and a date to assign this chore.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="championIds"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Champions</FormLabel>
                    <FormDescription>
                      Select the champion(s) to assign this chore to.
                    </FormDescription>
                  </div>
                  {champions.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="championIds"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.name}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Assignment Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-[240px] pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    The chore will be scheduled for this day.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Assign Chore</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
