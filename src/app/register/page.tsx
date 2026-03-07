'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '@/firebase/config';
import { useState } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChoreChampionLogo } from '@/app/components/ChoreChampionLogo';
import { Form, FormControl, FormField, FormItem, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, CheckCircle2, Copy } from 'lucide-react';

const CHAMPION_INTERNAL_PASSWORD = "CHAMPION_INTERNAL_ACCESS";

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is required.'),
  lastName: z.string().min(2, 'Last name is required.'),
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  firstChampionName: z.string().min(2, 'First champion name is required.'),
});

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const [isSuccess, setIsSuccess] = useState(false);
  const [championCode, setChampionCode] = useState('');

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { 
        firstName: '', 
        lastName: '', 
        email: '', 
        password: '',
        firstChampionName: '',
    },
  });

  const generateCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
        // 1. Create Parent User in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const parentUser = userCredential.user;

        // 2. Update Parent Auth Profile
        await updateProfile(parentUser, {
            displayName: `${values.firstName} ${values.lastName}`
        });

        // 3. Create Parent Profile in Firestore
        await setDoc(doc(firestore, 'users', parentUser.uid), {
            id: parentUser.uid,
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
        });

        // 4. Create First Champion
        const code = generateCode();
        const internalEmail = `${code.toLowerCase()}@champions.app`;
        
        // Use a temporary app instance to create the champion user without logging the parent out.
        const tempAppName = `temp-app-for-initial-champion-${Date.now()}`;
        const tempApp = initializeApp(firebaseConfig, tempAppName);
        const tempAuth = getAuth(tempApp);

        const champCredential = await createUserWithEmailAndPassword(tempAuth, internalEmail, CHAMPION_INTERNAL_PASSWORD);
        const champUid = champCredential.user.uid;
        
        await updateProfile(champCredential.user, { displayName: values.firstChampionName });

        await setDoc(doc(firestore, 'champions', champUid), {
            id: champUid,
            parentId: parentUser.uid,
            name: values.firstChampionName,
            username: code,
            email: internalEmail,
            points: 0,
        });

        await signOut(tempAuth);

        setChampionCode(code);
        setIsSuccess(true);

        toast({
            title: "Welcome!",
            description: "Your family account has been created successfully.",
        });

    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Account Creation Failed",
            description: error.message,
        });
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(championCode);
    toast({ title: "Code copied!", description: "Share this with your champion." });
  }

  if (isSuccess) {
    return (
        <div className="w-full min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-theme">
            <Card className="mx-auto w-full max-w-md shadow-xl border-2 border-primary">
                <CardContent className="pt-8 text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="bg-primary/10 p-4 rounded-full">
                            <CheckCircle2 className="h-12 w-12 text-primary" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold font-headline">Registration Complete!</h2>
                        <p className="text-muted-foreground">Your family account is ready.</p>
                    </div>
                    
                    <div className="bg-muted p-6 rounded-xl space-y-4">
                        <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">First Champion Code</p>
                        <div className="flex items-center justify-center gap-4">
                            <span className="text-4xl font-mono font-bold tracking-widest text-primary">{championCode}</span>
                            <Button variant="ghost" size="icon" onClick={copyCode}>
                                <Copy className="h-5 w-5" />
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Have your child use this code to log in. No password required!
                        </p>
                    </div>

                    <Button className="w-full" asChild size="lg">
                        <Link href="/dashboard">Go to Parent Dashboard</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
  }

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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Parent Information</h3>
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
                            <Label>Parent Email</Label>
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
                            <Label>Parent Password</Label>
                            <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-semibold text-lg border-b pb-2">First Champion</h3>
                    <FormField
                        control={form.control}
                        name="firstChampionName"
                        render={({ field }) => (
                        <FormItem>
                            <Label>Child's Name</Label>
                            <FormControl>
                            <Input placeholder="e.g. Alex" {...field} />
                            </FormControl>
                            <FormDescription>Your champion will log in using a code we'll generate for them.</FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                  </div>

                  <Button type="submit" className="w-full !mt-8" size="lg" disabled={form.formState.isSubmitting}>
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
