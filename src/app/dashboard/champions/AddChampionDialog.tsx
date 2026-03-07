
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  password: z.string().min(4, "Password must be at least 4 characters."),
});

// The shape of the data for a new champion
export type NewChampionData = z.infer<typeof formSchema>;

type AddChampionDialogProps = {
  onAdd: (champion: NewChampionData) => void;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  isAdding: boolean;
};

export function AddChampionDialog({ onAdd, isOpen, onOpenChange, isAdding }: AddChampionDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      password: "",
    },
  });

  // Reset form when dialog is closed
  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAdd(values);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Champion</DialogTitle>
          <DialogDescription>
            Create a profile for a new champion. A unique login code will be generated automatically.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Champion Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Alex" {...field} disabled={isAdding}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password (PIN)</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••"
                      {...field}
                      disabled={isAdding}
                    />
                  </FormControl>
                  <FormDescription>Set a simple password for your champion to use when logging in.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isAdding}>
                Cancel
              </Button>
              <Button type="submit" disabled={isAdding}>
                {isAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Champion
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
