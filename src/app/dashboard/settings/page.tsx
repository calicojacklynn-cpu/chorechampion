'use client';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account, family, and app settings.
        </p>
      </div>
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 max-w-4xl">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="family">Family</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="localization">Localization</TabsTrigger>
          <TabsTrigger value="themes">Themes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  This is how you are identified in the app.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="Parent" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="parent@example.com" />
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button>Save Profile</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button>Update Password</Button>
              </CardFooter>
            </Card>

            <Card className="border-destructive">
              <CardHeader>
                <CardTitle>Delete Account</CardTitle>
                <CardDescription>
                  Permanently delete your account and all associated data. This action cannot be undone.
                </CardDescription>
              </CardHeader>
              <CardFooter className="bg-destructive/10">
                <Button variant="destructive">Delete My Account</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
            <Card>
                <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>The "Nag" Filter. Manage how and when you receive alerts.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                        <div className="space-y-0.5">
                            <Label htmlFor="approval-alerts" className="text-base">Approval Alerts</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive an instant notification when a chore is submitted for review.
                            </p>
                        </div>
                        <Switch id="approval-alerts" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                        <div className="space-y-0.5">
                            <Label htmlFor="reward-milestones" className="text-base">Reward Milestones</Label>
                             <p className="text-sm text-muted-foreground">
                                Get an alert when a champion has enough points to claim a reward.
                            </p>
                        </div>
                        <Switch id="reward-milestones" defaultChecked />
                    </div>
                     <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                        <div className="space-y-0.5">
                           <Label htmlFor="family-broadcasts" className="text-base">Family Broadcasts</Label>
                             <p className="text-sm text-muted-foreground">
                                Allow admin messages to be sent to all champion devices.
                            </p>
                        </div>
                        <Switch id="family-broadcasts" />
                    </div>
                    <div className="space-y-2 p-4 rounded-lg border">
                        <Label htmlFor="chore-reminders" className="text-base">Chore Reminders</Label>
                        <p className="text-sm text-muted-foreground pb-2">
                           Customize the "Nudge" frequency for pending chores.
                        </p>
                        <Select defaultValue="standard">
                            <SelectTrigger className="w-full md:w-1/2">
                                <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="gentle">Gentle Pings (Once a day)</SelectItem>
                                <SelectItem value="standard">Standard (Morning and Evening)</SelectItem>
                                <SelectItem value="urgent">High-Priority (As deadline approaches)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
                 <CardFooter className="border-t px-6 py-4">
                    <Button>Save Notification Settings</Button>
                </CardFooter>
            </Card>
        </TabsContent>

        <TabsContent value="family">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>The Family Roster</CardTitle>
                        <CardDescription>Manage the "Players" and the "Gamemasters."</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className="p-4 rounded-lg border">
                           <h3 className="font-semibold mb-2">Admin Profiles</h3>
                           <p className="text-sm text-muted-foreground mb-4">Management for Parent and Adam. Admins can approve chores and manage points.</p>
                           <Button variant="outline">Manage Admins</Button>
                       </div>
                       <div className="p-4 rounded-lg border">
                           <h3 className="font-semibold mb-2">Child Profiles</h3>
                           <p className="text-sm text-muted-foreground mb-4">Customize usernames and "Hero" icons for your champions on the Champions page.</p>
                           <Button asChild>
                             <Link href="/dashboard/champions">Manage Champions</Link>
                           </Button>
                       </div>
                       <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                            <div className="space-y-0.5">
                                <Label htmlFor="age-filters" className="text-base">Age-Appropriate Filters</Label>
                                <p className="text-sm text-muted-foreground">
                                    Categorize chores by difficulty (e.g., "Level 1" vs. "Master Class").
                                </p>
                            </div>
                            <Switch id="age-filters" />
                        </div>
                    </CardContent>
                     <CardFooter className="border-t px-6 py-4">
                        <Button>Save Family Settings</Button>
                    </CardFooter>
                </Card>
            </div>
        </TabsContent>

        <TabsContent value="subscription">
            <Card>
                <CardHeader>
                    <CardTitle>The Treasury</CardTitle>
                    <CardDescription>Manage your Chore Champion Premium subscription.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg border">
                        <h3 className="font-semibold mb-2">Subscription Tier</h3>
                        <p className="text-sm text-muted-foreground">You are currently on the <span className="font-bold text-primary">Chore Champion Premium</span> plan.</p>
                        <p className="text-sm text-muted-foreground">This includes unlimited champions and advanced statistical tracking.</p>
                    </div>
                     <div className="p-4 rounded-lg border">
                        <h3 className="font-semibold mb-2">Billing Management</h3>
                        <p className="text-sm text-muted-foreground mb-4">Securely manage the payment method used for your subscription.</p>
                        <Button variant="outline">Manage Billing</Button>
                    </div>
                    <div className="p-4 rounded-lg border">
                        <h3 className="font-semibold mb-2">Transaction History</h3>
                        <p className="text-sm text-muted-foreground mb-4">View a clear record of subscription renewals and billing dates.</p>
                        <Button variant="outline">View History</Button>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="localization">
            <Card>
                <CardHeader>
                    <CardTitle>Language & Region</CardTitle>
                    <CardDescription>The Culture Setting. Sync the app with your life in Houma.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="localized-terminology">Localized Terminology</Label>
                        <p className="text-sm text-muted-foreground">Rename "Chores" to something more engaging.</p>
                        <Input id="localized-terminology" defaultValue="Daily Quests" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="currency-standardization">Currency Standardization</Label>
                        <p className="text-sm text-muted-foreground">Choose the visual representation of rewards.</p>
                        <Input id="currency-standardization" defaultValue="Champion Coins" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="time-zone">Time Zone Sync</Label>
                        <p className="text-sm text-muted-foreground">Synchronizes the "Daily Reset" of chores.</p>
                         <Select defaultValue="cst">
                            <SelectTrigger className="w-full md:w-1/2">
                                <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                                <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                                <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                                <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phonetic-dictionary">Phonetic Dictionary</Label>
                        <p className="text-sm text-muted-foreground">Help voice-to-text recognize local names and places.</p>
                        <Textarea id="phonetic-dictionary" placeholder="e.g., Thibodaux = tib-i-doe" defaultValue="Thibodaux = tib-i-doe" />
                    </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button>Save Localization Settings</Button>
                </CardFooter>
            </Card>
        </TabsContent>

        <TabsContent value="themes">
          <Card>
            <CardHeader>
              <CardTitle>Themes</CardTitle>
              <CardDescription>
                Customize the look and feel of your app.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Theme selection options will go here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
