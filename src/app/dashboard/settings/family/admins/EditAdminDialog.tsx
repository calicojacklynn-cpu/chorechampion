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
import { Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Admin } from "./page";
import { PlaceHolderImages } from "@/lib/placeholder-images";

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
  
  // Find the initial avatar URL from placeholder images if it exists
  const initialAvatar = PlaceHolderImages.find(p => p.id === admin.avatarId);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: admin.name,
      email: admin.email,
      avatarUrl: initialAvatar?.imageUrl || "",
    },
  });

  useEffect(() => {
    if (admin) {
      const currentAvatar = PlaceHolderImages.find(p => p.id === admin.avatarId);
      form.reset({
        name: admin.name,
        email: admin.email,
        avatarUrl: currentAvatar?.imageUrl || "",
      });
    }
  }, [admin, form]);

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
    // Note: We're not actually updating the avatarId, just the display URL for this mock.
    // In a real app you would upload the image and get a new URL.
    onSave({
      ...admin,
      ...values,
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Admin</DialogTitle>
          <DialogDescription>
            Update the details for {admin.name}.
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

            <FormField
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  {avatarUrl && (
                    <div className="flex justify-center py-2">
                      <Avatar className="h-24 w-24 border-2 border-primary">
                        <AvatarImage asChild>
                            <Image src={avatarUrl} width={96} height={96} alt="Avatar preview" className="object-cover" />
                        </AvatarImage>
                        <AvatarFallback>{admin.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                  <FormControl>
                    <Input placeholder="Paste an image URL..." {...field} value={field.value || ''}/>
                  </FormControl>
                  <div className="text-center text-xs text-muted-foreground my-2">
                    OR
                  </div>
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
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
