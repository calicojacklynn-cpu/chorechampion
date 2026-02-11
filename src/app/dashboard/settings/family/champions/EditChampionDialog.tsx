
"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload } from "lucide-react";

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

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  avatarUrl: z.string().optional(),
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      avatarUrl: "",
    },
  });

  const avatarUrl = form.watch("avatarUrl");

  useEffect(() => {
    if (isOpen && champion) {
      form.reset({
        name: champion.name,
        avatarUrl: champion.avatarUrl || "",
      });
    }
  }, [isOpen, champion, form]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("avatarUrl", reader.result as string, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave({
      ...champion,
      ...values,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md grid grid-rows-[auto_1fr_auto] p-0 max-h-[90vh]">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle>Edit Champion</DialogTitle>
          <DialogDescription>
            Update the details for {champion?.name}. Email and password cannot be changed.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-full overflow-y-auto">
            <div className="px-6">
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

                    <FormField
                        control={form.control}
                        name="avatarUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Avatar</FormLabel>
                                <div className="flex justify-center py-2">
                                <Avatar className="h-24 w-24 border-2 border-primary">
                                    <AvatarImage src={avatarUrl} alt="Avatar preview" />
                                    <AvatarFallback>{champion?.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                </div>
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
                    </form>
                </Form>
            </div>
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
