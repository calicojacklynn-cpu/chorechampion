
'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { signInWithEmailAndPassword, signOut, signInAnonymously } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChoreChampionLogo } from '@/app/components/ChoreChampionLogo';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Info, Sparkles } from 'lucide-react';

const CHAMPION_INTERNAL_PASSWORD = "CHAMPION_INTERNAL_ACCESS";

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

const championLoginSchema = z.object({
  code: z.string().min(4, 'Please enter your champion code.'),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const parentForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const championForm = useForm<z.infer<typeof championLoginSchema>>({
    resolver: zodResolver(championLoginSchema),
    defaultValues: { code: '' },
  });

  const handleParentLogin = async (values: z.infer<typeof loginSchema>) => {
    try {
        if (auth.currentUser) {
            await signOut(auth);
        }
        
        const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
        const loggedInUser = userCredential.user;
        
        const parentProfileDocRef = doc(firestore, 'users', loggedInUser.uid);
        const docSnap = await getDoc(parentProfileDocRef);

        if (!docSnap.exists()) {
            router.push(`/champion/${loggedInUser.uid}`);
        } else {
            router.push('/dashboard');
        }
    } catch (error: any) {
        toast({ 
            variant: "destructive", 
            title: "Login Failed", 
            description: error.code === 'auth/invalid-credential' 
                ? "Invalid email or password." 
                : error.message 
        });
    }
  };
  
  const handleChampionLogin = async (values: z.infer<typeof championLoginSchema>) => {
    try {
      if (auth.currentUser) {
          await signOut(auth);
      }

      const internalEmail = `${values.code.toLowerCase()}@champions.app`;
      const userCredential = await signInWithEmailAndPassword(auth, internalEmail, CHAMPION_INTERNAL_PASSWORD);
      router.push(`/champion/${userCredential.user.uid}`);
    } catch (error: any) {
      toast({ 
          variant: "destructive", 
          title: "Login Failed", 
          description: "Invalid code. Please check with your parent."
      });
    }
  };

  const handleParentInstantAccess = async () => {
    try {
      if (auth.currentUser) await signOut(auth);
      const userCredential = await signInAnonymously(auth);
      const uid = userCredential.user.uid;
      
      // Check if doc exists first to be safe
      const docRef = doc(firestore, 'users', uid);
      const snap = await getDoc(docRef);
      
      if (!snap.exists()) {
        await setDoc(docRef, {
          id: uid,
          email: 'instant-parent@test.local',
          firstName: 'Instant',
          lastName: 'Parent'
        });
      }
      
      router.push('/dashboard');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Instant Access Failed", description: error.message });
    }
  };

  const handleChampionInstantAccess = async () => {
    try {
      if (auth.currentUser) await signOut(auth);
      const userCredential = await signInAnonymously(auth);
      const uid = userCredential.user.uid;
      
      const docRef = doc(firestore, 'champions', uid);
      const snap = await getDoc(docRef);
      
      if (!snap.exists()) {
        await setDoc(docRef, {
          id: uid,
          parentId: 'backdoor-parent-id',
          name: 'Alex',
          username: 'ALEX12',
          email: 'instant-champion@test.local',
          points: 125
        });
      }
      
      router.push(`/champion/${uid}`);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Instant Access Failed", description: error.message });
    }
  };
  
  useEffect(() => {
    if (!isUserLoading && user) {
      const checkRole = async () => {
        const parentProfileDocRef = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(parentProfileDocRef);
        if (docSnap.exists()) {
          router.push('/dashboard');
        } else {
          // Check for champion doc
          const champRef = doc(firestore, 'champions', user.uid);
          const champSnap = await getDoc(champRef);
          if (champSnap.exists()) {
            router.push(`/champion/${user.uid}`);
          }
        }
      }
      checkRole();
    }
  }, [isUserLoading, user, router, firestore]);

  if (isUserLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    )
  }
  
  if (user) {
    return (
       <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-theme">
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
              <Card className="mt-6 border-transparent bg-transparent shadow-none">
                <CardContent className="p-0 space-y-6">
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
                      <Button type="submit" className="w-full !mt-6" disabled={parentForm.formState.isSubmitting}>
                        {parentForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Log In
                      </Button>
                    </form>
                  </Form>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">New to Chore Champion?</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/register">Create Family Account</Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="child">
              <Card className="mt-6 border-transparent bg-transparent shadow-none">
                <CardContent className="p-0">
                  <Form {...championForm}>
                      <form onSubmit={championForm.handleSubmit(handleChampionLogin)} className="space-y-4">
                        <FormField
                          control={championForm.control}
                          name="code"
                          render={({ field }) => (
                            <FormItem>
                              <Label>Champion Code</Label>
                              <FormControl>
                                <Input placeholder="ABC-123" className="uppercase" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full !mt-6" disabled={championForm.formState.isSubmitting}>
                          {championForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Champion Log In
                        </Button>
                      </form>
                    </Form>
                    <p className="mt-4 text-center text-xs text-muted-foreground">
                      Champions: Enter your unique code provided by your parent.
                    </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8 pt-6 border-t border-muted flex flex-col gap-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider">
              <Sparkles className="h-3 w-3" />
              <span>Development Shortcuts (Instant Access)</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={handleParentInstantAccess}>
                Instant Parent Access
              </Button>
              <Button variant="outline" size="sm" onClick={handleChampionInstantAccess}>
                Instant Champion Access
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center italic">
              Note: Instant access uses anonymous sessions. Profiles created here are temporary and browser-specific.
            </p>
          </div>
        </div>
      </div>
  );
}
