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
import type { Admin } from "./page";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  avatarUrl: z.string().optional(),
});

type EditAdminDialogProps = {
  admin: Admin;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (admin: Admin) => void;
};

export function EditAdminDialog({
  admin,
  isOpen,
  onOpenChange,
  onSave,
}: EditAdminDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      avatarUrl: "",
    },
  });

  useEffect(() => {
    if (admin && isOpen) {
      form.reset({
        name: admin.name,
        email: admin.email,
        avatarUrl: admin.avatarUrl || "",
      });
    }
  }, [admin, isOpen, form]);

  const avatarUrl = form.watch("avatarUrl");

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("avatarUrl", reader.result as string, {
          shouldValidate: true,
        });
      };
      reader.readAsDataURL(file);
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave({
      ...admin,
      ...values,
      avatarUrl: values.avatarUrl || "",
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] grid grid-rows-[auto_1fr_auto] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle>Edit Admin</DialogTitle>
          <DialogDescription>
            Update the details for {admin.name}.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="px-6 overflow-y-auto">
          <Form {...form}>
            <form id="edit-admin-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Adam" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. adam@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Avatar</FormLabel>
                <div className="flex justify-center py-2">
                  <Avatar className="h-24 w-24 border-2 border-primary">
                    <AvatarImage src={avatarUrl} alt="Avatar preview" className="object-cover" />
                    <AvatarFallback>{admin.name.charAt(0)}</AvatarFallback>
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
                <FormField control={form.control} name="avatarUrl" render={() => <FormMessage />} />
              </FormItem>
            </form>
          </Form>
        </ScrollArea>
        <DialogFooter className="p-6 border-t">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="edit-admin-form">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
