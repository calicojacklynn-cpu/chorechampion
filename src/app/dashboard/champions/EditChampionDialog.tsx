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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Champion } from "./page";

// Zod schema for form validation
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
});

// Component props
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
      name: "",
    },
  });

  // Reset form fields when the dialog is opened or the champion prop changes
  useEffect(() => {
    if (isOpen && champion) {
      form.reset({
        name: champion.name,
      });
    }
  }, [isOpen, champion, form]);

  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave({
      ...champion,
      ...values,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md grid grid-rows-[auto_1fr_auto] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle>Edit Champion</DialogTitle>
          <DialogDescription>
            Update the details for {champion?.name}. Email and password cannot be changed.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-full overflow-y-auto px-6">
          <Form {...form}>
            <form id="edit-champion-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
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

              <FormItem>
                <FormLabel>Avatar</FormLabel>
                <div className="flex justify-center py-2">
                  <Avatar className="h-24 w-24 border-2 border-primary">
                    <AvatarImage src={champion?.avatarUrl} alt="Avatar preview" />
                    <AvatarFallback>{champion?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <p className="text-sm text-muted-foreground">Avatar can be updated by the champion in their own settings.</p>
              </FormItem>
            </form>
          </Form>
        </ScrollArea>

        <DialogFooter className="p-6 border-t">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="edit-champion-form">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
