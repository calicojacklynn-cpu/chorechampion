"use client";

import { useEffect, useRef } from "react";
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
import { Upload } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().optional(),
  points: z.coerce.number().min(1, "Points must be at least 1."),
  imageUrl: z.string().optional(),
});

type EditRewardDialogProps = {
  reward: Reward;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (reward: Reward) => void;
};

export function EditRewardDialog({ reward, isOpen, onOpenChange, onSave }: EditRewardDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
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
  const isUrlValid = imageUrl && (imageUrl.startsWith('http') || imageUrl.startsWith('data:image'));


  useEffect(() => {
    // Reset the form with the new reward's data whenever the reward prop changes.
    if (reward && isOpen) {
      form.reset({
        name: reward.name,
        description: reward.description,
        points: reward.points,
        imageUrl: reward.imageUrl || "",
      });
    }
  }, [reward, isOpen, form]);

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
    onSave({
      ...reward,
      ...values,
      description: values.description || "",
      imageUrl: values.imageUrl || ""
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] flex flex-col max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4 flex-shrink-0">
          <DialogTitle>Edit Reward</DialogTitle>
          <DialogDescription>
            Update the details for this reward.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0">
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
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
                        <Textarea placeholder="Describe the reward..." {...field} value={field.value || ''} />
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
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload from Device
                        </Button>
                      </FormControl>
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

            <DialogFooter className="p-6 border-t flex-shrink-0">
               <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
