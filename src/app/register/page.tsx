'use client';

import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChoreChampionLogo } from '@/app/components/ChoreChampionLogo';
import { Form, FormControl, FormField, FormItem, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, CheckCircle2, Copy, Plus, Trash2, Users, UserPlus } from 'lucide-react';

const CHAMPION_INTERNAL_PASSWORD = "CHAMPION_INTERNAL_ACCESS";

const parentSchema = z.object({
  firstName: z.string().min(2, 'First name is required.'),
  lastName: z.string().min(2, 'Last name is required.'),
  email: z.string().email('Valid email required.'),
});

const championSchema = z.object({
  name: z.string().min(2, 'Champion name is required.'),
});

const registerSchema = z.object({
  parents: z.array(parentSchema).min(1).max(2),
  champions: z.array(championSchema).min(1).max(3),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const [isSuccess, setIsSuccess] = useState(false);
  const [results, setResults] = useState<{ name: string; code: string }[]>([]);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      parents: [{ firstName: '', lastName: '', email: '' }],
      champions: [{ name: '' }],
      password: '',
    },
  });

  const { fields: parentFields, append: addParent, remove: removeParent } = useFieldArray({
    control: form.control,
    name: "parents",
  });

  const { fields: championFields, append: addChampion, remove: removeChampion } = useFieldArray({
    control: form.control,
    name: "champions",
  });

  const generateCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      // 1. Create Primary Parent
      const primaryParent = values.parents[0];
      const userCredential = await createUserWithEmailAndPassword(auth, primaryParent.email, values.password);
      const primaryParentUid = userCredential.user.uid;

      await updateProfile(userCredential.user, {
        displayName: `${primaryParent.firstName} ${primaryParent.lastName}`
      });

      await setDoc(doc(firestore, 'users', primaryParentUid), {
        id: primaryParentUid,
        email: primaryParent.email,
        firstName: primaryParent.firstName,
        lastName: primaryParent.lastName,
      });

      // 2. Handle Secondary Parent and Champions using temp app instances
      const createdChampions: { name: string; code: string }[] = [];

      // Secondary Parent
      if (values.parents.length > 1) {
        const secondary = values.parents[1];
        const tempApp = initializeApp(firebaseConfig, `temp-parent-${Date.now()}`);
        const tempAuth = getAuth(tempApp);
        const secCred = await createUserWithEmailAndPassword(tempAuth, secondary.email, values.password);
        await updateProfile(secCred.user, { displayName: `${secondary.firstName} ${secondary.lastName}` });
        await setDoc(doc(firestore, 'users', secCred.user.uid), {
          id: secCred.user.uid,
          email: secondary.email,
          firstName: secondary.firstName,
          lastName: secondary.lastName,
        });
        await signOut(tempAuth);
      }

      // Champions
      for (const champ of values.champions) {
        const code = generateCode();
        const internalEmail = `${code.toLowerCase()}@champions.app`;
        const tempApp = initializeApp(firebaseConfig, `temp-champ-${Date.now()}-${Math.random()}`);
        const tempAuth = getAuth(tempApp);

        const champCred = await createUserWithEmailAndPassword(tempAuth, internalEmail, CHAMPION_INTERNAL_PASSWORD);
        const champUid = champCred.user.uid;

        await updateProfile(champCred.user, { displayName: champ.name });

        await setDoc(doc(firestore, 'champions', champUid), {
          id: champUid,
          parentId: primaryParentUid,
          name: champ.name,
          username: code,
          email: internalEmail,
          points: 0,
        });

        createdChampions.push({ name: champ.name, code });
        await signOut(tempAuth);
      }

      setResults(createdChampions);
      setIsSuccess(true);

      toast({
        title: "Family Registered!",
        description: "Welcome to Chore Champion!",
      });

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message,
      });
    }
  };

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
              <h2 className="text-3xl font-bold font-headline">Family Ready!</h2>
              <p className="text-muted-foreground">Your champion login codes are below:</p>
            </div>

            <div className="space-y-3">
              {results.map((res, i) => (
                <div key={i} className="bg-muted p-4 rounded-xl flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">{res.name}'s Code</p>
                    <p className="text-2xl font-mono font-bold text-black">{res.code}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => {
                    navigator.clipboard.writeText(res.code);
                    toast({ title: "Code copied!" });
                  }}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button className="w-full" asChild size="lg">
              <Link href="/dashboard">Go to Parent Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-theme">
      <div className="mx-auto w-full max-w-2xl space-y-8">
        <div className="flex flex-col items-center">
          <ChoreChampionLogo className="h-16 w-16" />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground font-headline">
            Create Family Account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Register your family and start your champion journey.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Parents Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Parents
                </CardTitle>
                <CardDescription>Up to two parent or guardian accounts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {parentFields.map((field, index) => (
                  <div key={field.id} className="space-y-4 p-4 border rounded-lg relative">
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 text-destructive"
                        onClick={() => removeParent(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    <h4 className="font-medium text-sm text-muted-foreground uppercase">Parent {index + 1}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`parents.${index}.firstName`}
                        render={({ field }) => (
                          <FormItem>
                            <Label>First Name</Label>
                            <FormControl><Input placeholder="Jane" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`parents.${index}.lastName`}
                        render={({ field }) => (
                          <FormItem>
                            <Label>Last Name</Label>
                            <FormControl><Input placeholder="Doe" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name={`parents.${index}.email`}
                      render={({ field }) => (
                        <FormItem>
                          <Label>Email</Label>
                          <FormControl><Input type="email" placeholder="jane@example.com" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
                {parentFields.length < 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-dashed"
                    onClick={() => addParent({ firstName: '', lastName: '', email: '' })}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Second Parent
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Champions Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Champions
                </CardTitle>
                <CardDescription>Add between 1 and 3 children to your family.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {championFields.map((field, index) => (
                  <div key={field.id} className="space-y-4 p-4 border rounded-lg relative">
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 text-destructive"
                        onClick={() => removeChampion(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    <h4 className="font-medium text-sm text-muted-foreground uppercase">Champion {index + 1}</h4>
                    <FormField
                      control={form.control}
                      name={`champions.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <Label>Name</Label>
                          <FormControl><Input placeholder="Alex" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
                {championFields.length < 3 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-dashed"
                    onClick={() => addChampion({ name: '' })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Champion
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Security Section */}
            <Card>
              <CardHeader>
                <CardTitle>Family Security</CardTitle>
                <CardDescription>Set a password for your parent accounts.</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Shared Parent Password</Label>
                      <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                      <FormDescription>This password will be used for all parent logins.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex flex-col gap-4">
              <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Register Family & Generate Codes
              </Button>
              <Button variant="link" asChild className="text-muted-foreground">
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </Link>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
