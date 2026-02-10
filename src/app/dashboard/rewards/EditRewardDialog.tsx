"use client";

import { useEffect } from "react";
import Image from "next/image";
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
import { Textarea } from "@/components/ui/textarea";
import type { Reward } from "./page";
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().optional(),
  points: z.coerce.number().min(1, "Points must be at least 1."),
  imageUrl: z.string().url({ message: "Please enter a valid image URL." }).optional().or(z.literal('')),
});

type EditRewardDialogProps = {
  reward: Reward;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (reward: Reward) => void;
};

export function EditRewardDialog({ reward, isOpen, onOpenChange, onSave }: EditRewardDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: reward.name,
      description: reward.description,
      points: reward.points,
      imageUrl: reward.imageUrl || "",
    },
  });
  
  const imageUrl = form.watch("imageUrl");
  const isUrlValid = z.string().url().safeParse(imageUrl).success;


  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: reward.name,
        description: reward.description,
        points: reward.points,
        imageUrl: reward.imageUrl || "",
      });
    }
  }, [isOpen, reward, form]);


  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave({
      ...reward,
      ...values,
      description: values.description || "",
      imageUrl: values.imageUrl || ""
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Reward</DialogTitle>
          <DialogDescription>
            Update the details for this reward.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="h-[60vh] pr-6">
              <div className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reward Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Movie Night" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the reward..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="points"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Point Cost</FormLabel>
                      <FormControl>
                        <Input type="number" inputMode="numeric" min={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.png" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {imageUrl && isUrlValid && (
                  <div>
                    <FormLabel>Image Preview</FormLabel>
                    <div className="relative aspect-video w-full mt-2 rounded-md overflow-hidden border">
                        <Image src={imageUrl} alt="Reward image preview" fill className="object-cover" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <DialogFooter className="pt-4">
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
