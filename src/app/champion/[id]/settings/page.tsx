'use client';

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUser, useAuth } from "@/firebase";
import { updateProfile } from "firebase/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";


const profileFormSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters."),
  photoURL: z.string().optional(),
});

export default function ChampionSettingsPage() {
    const { toast } = useToast();
    const auth = useAuth();
    const { user } = useUser();
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof profileFormSchema>>({
        resolver: zodResolver(profileFormSchema),
        values: {
            displayName: user?.displayName || "",
            photoURL: user?.photoURL || "",
        }
    });

    const photoUrl = form.watch("photoURL");

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            form.setValue('photoURL', reader.result as string, { shouldValidate: true });
          };
          reader.readAsDataURL(file);
        }
    }

    const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
        if (!user) return;
        setIsSaving(true);
        try {
            await updateProfile(user, {
                displayName: values.displayName,
                photoURL: values.photoURL,
            });
            toast({
                title: "Profile Updated!",
                description: "Your changes have been saved successfully.",
            });
        } catch (error: any) {
             toast({
                variant: "destructive",
                title: "Update Failed",
                description: error.message,
            });
        } finally {
            setIsSaving(false);
        }
    }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your champion profile.
        </p>
      </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                <CardHeader>
                    <CardTitle>Your Profile</CardTitle>
                    <CardDescription>
                    This is how you appear in the app.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                     <FormField
                        control={form.control}
                        name="photoURL"
                        render={() => (
                            <FormItem>
                                <Label>Avatar</Label>
                                <div className="flex items-center gap-4">
                                     <Avatar className="h-20 w-20 border">
                                        <AvatarImage src={photoUrl || undefined} alt={user?.displayName || "Champion"} />
                                        <AvatarFallback>{user?.displayName?.charAt(0) || 'C'}</AvatarFallback>
                                    </Avatar>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isSaving}
                                        >
                                        <Upload className="mr-2 h-4 w-4" />
                                        Change Avatar
                                    </Button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept="image/png, image/jpeg, image/gif, image/webp"
                                    />
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="displayName"
                        render={({ field }) => (
                            <FormItem>
                            <Label>Display Name</Label>
                            <FormControl>
                                <Input {...field} disabled={isSaving} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button type="submit" disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </CardFooter>
                </Card>
            </form>
        </Form>
    </div>
  );
}
