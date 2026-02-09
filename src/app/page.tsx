import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChoreChampionLogo } from '@/app/components/ChoreChampionLogo';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LoginPage() {
  const loginImage = PlaceHolderImages.find(p => p.id === 'login-hero');
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
              <Card className="mt-6 border-transparent bg-transparent shadow-none">
                <CardContent className="space-y-6 p-0">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="parent-email">Email</Label>
                      <Input id="parent-email" type="email" placeholder="parent@example.com" required />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="parent-password">Password</Label>
                        <Link href="#" className="ml-auto inline-block text-sm underline">
                          Forgot your password?
                        </Link>
                      </div>
                      <Input id="parent-password" type="password" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                      <Link href="/dashboard">Login</Link>
                    </Button>
                    <Button variant="outline" className="w-full">
                      Create an account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="child">
              <Card className="mt-6 border-transparent bg-transparent shadow-none">
                <CardContent className="space-y-6 p-0">
                  <div className="space-y-2">
                    <Label htmlFor="child-username">Username</Label>
                    <Input id="child-username" placeholder="alex-the-great" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="child-password">PIN Code</Label>
                    <Input id="child-password" type="password" placeholder="••••" required />
                  </div>
                  <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Link href="/dashboard">Login</Link>
                  </Button>
                </CardContent>
              </Card>
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
