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

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and profile settings.
        </p>
      </div>
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

        <Card>
          <CardHeader>
              <CardTitle>Language & Region</CardTitle>
              <CardDescription>The Culture Setting. Sync the app with your life.</CardDescription>
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
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
              <Button>Save Localization Settings</Button>
          </CardFooter>
        </Card>

        <Card className="border-destructive">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-lg">Delete Account</CardTitle>
              <CardDescription>
                Permanently delete your account and all data.
              </CardDescription>
            </div>
            <Button variant="destructive" size="sm">Delete</Button>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
