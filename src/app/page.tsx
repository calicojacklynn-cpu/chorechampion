'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChoreChampionLogo } from '@/app/components/ChoreChampionLogo';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const parentLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

const championLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});


export default function LoginPage() {
  const loginImage = PlaceHolderImages.find(p => p.id === 'login-hero');
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const parentForm = useForm<z.infer<typeof parentLoginSchema>>({
    resolver: zodResolver(parentLoginSchema),
    defaultValues: { email: '', password: '' },
  });

  const championForm = useForm<z.infer<typeof championLoginSchema>>({
    resolver: zodResolver(championLoginSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleParentLogin = async (values: z.infer<typeof parentLoginSchema>) => {
    let userCredential: UserCredential | undefined;
    try {
        // Try to sign in first
        userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
    } catch (signInError: any) {
        // If user not found or invalid credential, try to sign them up
        if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/invalid-credential') {
            try {
                userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
            } catch (signUpError: any) {
                toast({ variant: "destructive", title: "Sign Up Failed", description: signUpError.message });
                return; // Stop execution on failed sign-up
            }
        } else {
            toast({ variant: "destructive", title: "Login Failed", description: signInError.message });
            return; // Stop execution on other login errors
        }
    }

    if (!userCredential) return;

    try {
        // Now that we have a user, ensure their profile exists
        const loggedInUser = userCredential.user;
        const parentProfileDocRef = doc(firestore, 'users', loggedInUser.uid);
        const docSnap = await getDoc(parentProfileDocRef);

        if (!docSnap.exists()) {
            const nameParts = loggedInUser.email?.split('@')[0].split('.') || ['New', 'User'];
            const firstName = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1) : 'New';
            const lastName = nameParts.length > 1 ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : 'User';
            await setDoc(parentProfileDocRef, {
                id: loggedInUser.uid,
                email: loggedInUser.email,
                firstName: firstName,
                lastName: lastName,
            });
        }
        
        // All checks and creation are done. Now, navigate.
        router.push('/dashboard');

    } catch (profileError: any) {
        toast({ variant: "destructive", title: "Profile Error", description: profileError.message });
    }
  };
  
  const handleChampionLogin = async (values: z.infer<typeof championLoginSchema>) => {
    let userCredential: UserCredential | undefined;
    try {
      userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
    } catch (signInError: any) {
      if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/invalid-credential') {
        try {
          userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
          toast({
            title: 'Welcome!',
            description: "Your champion account has been created."
          });
        } catch (signUpError: any) {
          toast({ variant: "destructive", title: "Sign Up Failed", description: signUpError.message });
          return;
        }
      } else {
        toast({ variant: "destructive", title: "Login Failed", description: signInError.message });
        return;
      }
    }

    if (!userCredential) return;

    // After login/signup, navigate to the specific champion page.
    router.push(`/champion/${userCredential.user.uid}`);
  };
  
  // Redirect already logged-in users. This hook is safe because it only runs *after*
  // the initial auth state is resolved and a user is present.
  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [isUserLoading, user, router]);

  // If we are still determining the auth state, show a loader.
  // We no longer redirect if user is present, that's handled by the useEffect above.
  if (isUserLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    )
  }
  
  // If a user is logged in, this page will redirect, so we can show a loader
  // or null to prevent the login form from flashing.
  if (user) {
    return (
       <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div>
            <div className="flex justify-center">
              <ChoreChampionLogo className="h-20 w-20" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground font-headline">
              Welcome to Chore Champion
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Let's get those chores done!
            </p>
          </div>

          <Tabs defaultValue="parent" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="parent">Parent</TabsTrigger>
              <TabsTrigger value="child">Champion</TabsTrigger>
            </TabsList>
            <TabsContent value="parent">
              <div className="relative">
                <Button
                    variant="link"
                    className="absolute -top-4 left-0 h-auto p-0 text-sm text-muted-foreground z-10"
                    onClick={() => handleParentLogin({ email: 'parent@example.com', password: 'password' })}
                >
                    Admin Backdoor
                </Button>
                <Card className="mt-6 border-transparent bg-transparent shadow-none">
                  <CardContent className="p-0">
                    <Form {...parentForm}>
                      <form onSubmit={parentForm.handleSubmit(handleParentLogin)} className="space-y-4">
                        <FormField
                          control={parentForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <Label>Email</Label>
                              <FormControl>
                                <Input type="email" placeholder="parent@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={parentForm.control}
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
                        <Button type="submit" className="w-full !mt-6 bg-accent hover:bg-accent/90 text-accent-foreground" disabled={parentForm.formState.isSubmitting}>
                          {parentForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Login or Sign Up
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="child">
              <div className="relative">
                 <Button
                    variant="link"
                    className="absolute -top-4 left-0 h-auto p-0 text-sm text-muted-foreground z-10"
                    onClick={() => handleChampionLogin({ email: 'alex@example.com', password: 'password' })}
                >
                    Admin Backdoor
                </Button>
                <Card className="mt-6 border-transparent bg-transparent shadow-none">
                  <CardContent className="p-0">
                    <Form {...championForm}>
                        <form onSubmit={championForm.handleSubmit(handleChampionLogin)} className="space-y-4">
                          <FormField
                            control={championForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <Label>Email</Label>
                                <FormControl>
                                  <Input type="email" placeholder="alex@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={championForm.control}
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
                          <Button type="submit" className="w-full !mt-6" disabled={championForm.formState.isSubmitting}>
                            {championForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Login or Sign Up
                          </Button>
                        </form>
                      </Form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        {loginImage && (
          <Image
            src={loginImage.imageUrl}
            alt={loginImage.description}
            fill
            className="object-cover"
            data-ai-hint={loginImage.imageHint}
            priority
          />
        )}
      </div>
    </div>
  );
}
