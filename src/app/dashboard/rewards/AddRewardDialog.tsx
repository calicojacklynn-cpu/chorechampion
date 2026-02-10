"use client";

import { useState, useRef } from "react";
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
  DialogTrigger,
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
import { PlusCircle, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Reward } from "./page";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().optional(),
  points: z.coerce.number().min(1, "Points must be at least 1."),
  imageUrl: z.string().optional(),
});

type AddRewardDialogProps = {
    onAdd: (reward: Omit<Reward, 'id'>) => void;
};

export function AddRewardDialog({ onAdd }: AddRewardDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      points: 10,
      imageUrl: "",
    },
  });

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('imageUrl', reader.result as string, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAdd(values);
    toast({
      title: "Reward Added!",
      description: `${values.name} has been added to the reward catalog.`,
    });
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Reward
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Reward</DialogTitle>
          <DialogDescription>
            Fill out the details for the new reward you want to offer.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
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
                  <FormLabel>Image (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Paste an image URL..." {...field} />
                  </FormControl>
                  <div className="text-center text-xs text-muted-foreground my-2">OR</div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload from Device
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/png, image/jpeg, image/gif, image/webp"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Create Reward</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
