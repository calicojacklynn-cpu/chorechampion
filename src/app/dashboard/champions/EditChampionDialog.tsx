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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import type { Champion } from "./page";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  username: z
    .string()
    .min(2, "Username must be at least 2 characters.")
    .refine((s) => !s.includes(" "), "Username cannot contain spaces."),
  avatarUrl: z.string().optional(),
});

type EditChampionDialogProps = {
  champion: Champion;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (champion: Champion) => void;
};

const defaultAvatars = PlaceHolderImages.filter((p) =>
  p.id.startsWith("champion-avatar-")
);

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
      name: champion.name,
      username: champion.username,
      avatarUrl: champion.avatarUrl || "",
    },
  });

  // This effect hook will reset the form whenever a new champion is selected.
  // This is the correct way to handle this when not re-mounting the component with a key.
  useEffect(() => {
    if (champion) {
      form.reset({
        name: champion.name,
        username: champion.username,
        avatarUrl: champion.avatarUrl || "",
      });
    }
  }, [champion, form]);

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
      ...champion,
      ...values,
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Champion</DialogTitle>
          <DialogDescription>
            Update the details for {champion.name}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="h-[70vh] pr-6">
              <div className="space-y-4 py-4">
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
                        <Input
                          placeholder="e.g. alex-the-great"
                          {...field}
                        />
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
                              <Image
                                src={avatarUrl}
                                width={96}
                                height={96}
                                alt="Avatar preview"
                                className="object-cover"
                              />
                            </AvatarImage>
                            <AvatarFallback>
                              {champion.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      )}
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
                      <div className="text-center text-xs text-muted-foreground my-2">
                        OR
                      </div>

                      <div className="space-y-2 pt-2">
                        <p className="text-sm text-muted-foreground">
                          Choose a default avatar
                        </p>
                        <Carousel
                          opts={{
                            align: "start",
                          }}
                          className="w-full"
                        >
                          <CarouselContent>
                            {defaultAvatars.map((avatar) => (
                              <CarouselItem
                                key={avatar.id}
                                className="basis-1/3"
                              >
                                <div
                                  className="p-1 cursor-pointer"
                                  onClick={() =>
                                    form.setValue("avatarUrl", avatar.imageUrl, {
                                      shouldValidate: true,
                                    })
                                  }
                                >
                                  <Avatar
                                    className={cn("h-20 w-20 border-2", avatarUrl === avatar.imageUrl && "border-primary" )}
                                  >
                                    <AvatarImage asChild>
                                      <Image
                                        src={avatar.imageUrl}
                                        width={80}
                                        height={80}
                                        alt={avatar.description}
                                        data-ai-hint={avatar.imageHint}
                                        className="object-cover"
                                      />
                                    </AvatarImage>
                                  </Avatar>
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious />
                          <CarouselNext />
                        </Carousel>
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />
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
