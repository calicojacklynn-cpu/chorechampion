import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChoreChampionLogo } from '@/app/components/ChoreChampionLogo';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const champions = [
    {
        id: "alex",
        name: "Alex",
        avatarUrl: PlaceHolderImages.find(p => p.id === 'champion-avatar-1')?.imageUrl,
    },
    {
        id: "bella",
        name: "Bella",
        avatarUrl: PlaceHolderImages.find(p => p.id === 'champion-avatar-2')?.imageUrl,
    },
];

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
                      <Label htmlFor="parent-password">Password</Label>
                      <Input id="parent-password" type="password" required />
                    </div>
                  </div>
                  <div className="space-y-2 pt-4">
                    <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                      <Link href="/dashboard">Login</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="child">
              <Card className="mt-6 border-transparent bg-transparent shadow-none">
                <CardHeader className="text-center p-0">
                    <CardTitle className="font-headline">Who are you?</CardTitle>
                    <CardDescription>Select your profile to log in.</CardDescription>
                </CardHeader>
                <CardContent className="mt-8 flex justify-center gap-6">
                    {champions.map((champion) => (
                        <Link key={champion.id} href={`/champion/${champion.id}`} className="flex flex-col items-center gap-3 text-center group">
                            <Avatar className="h-28 w-28 border-4 border-transparent group-hover:border-primary transition-colors">
                                <AvatarImage src={champion.avatarUrl} alt={champion.name} />
                                <AvatarFallback>{champion.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-bold text-xl font-headline text-foreground">{champion.name}</span>
                        </Link>
                    ))}
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
