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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Champion } from "./page";

// Don't allow editing PIN for now, just name and username.
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  username: z
    .string()
    .min(2, "Username must be at least 2 characters.")
    .refine((s) => !s.includes(" "), "Username cannot contain spaces."),
});

type EditChampionDialogProps = {
  champion: Champion;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (champion: Champion) => void;
};

export function EditChampionDialog({
  champion,
  isOpen,
  onOpenChange,
  onSave,
}: EditChampionDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: champion.name,
      username: champion.username,
    },
  });

  // Reset form when the champion prop changes
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: champion.name,
        username: champion.username,
      });
    }
  }, [isOpen, champion, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave({
      ...champion, // keep original id, points, etc.
      ...values, // overwrite name and username
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Champion</DialogTitle>
          <DialogDescription>
            Update the details for {champion.name}.
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
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Alex" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. alex-the-great" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
