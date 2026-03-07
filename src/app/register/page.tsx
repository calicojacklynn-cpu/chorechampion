'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChoreChampionLogo } from '@/app/components/ChoreChampionLogo';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is required.'),
  lastName: z.string().min(2, 'Last name is required.'),
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { 
        firstName: '', 
        lastName: '', 
        email: '', 
        password: '' 
    },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
        // 1. Create User in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const user = userCredential.user;

        // 2. Update Auth Profile
        await updateProfile(user, {
            displayName: `${values.firstName} ${values.lastName}`
        });

        // 3. Create Parent Profile in Firestore
        await setDoc(doc(firestore, 'users', user.uid), {
            id: user.uid,
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
        });

        toast({
            title: "Welcome!",
            description: "Your family account has been created successfully.",
        });

        router.push('/dashboard');
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Account Creation Failed",
            description: error.message,
        });
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-theme">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div className="flex flex-col items-center">
            <ChoreChampionLogo className="h-16 w-16" />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground font-headline">
              Create Family Account
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Start your journey to becoming a Chore Champion family.
            </p>
          </div>

          <Card className="shadow-xl">
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                        <FormItem>
                            <Label>First Name</Label>
                            <FormControl>
                            <Input placeholder="Jane" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                        <FormItem>
                            <Label>Last Name</Label>
                            <FormControl>
                            <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Email</Label>
                        <FormControl>
                          <Input type="email" placeholder="jane.doe@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Password</Label>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full !mt-6" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Register Family
                  </Button>
                </form>
              </Form>
              
              <div className="mt-6 text-center">
                <Button variant="link" asChild className="text-muted-foreground">
                    <Link href="/" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Login
                    </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}
