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
import { Textarea } from "@/components/ui/textarea";

export default function LocalizationSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Localization Settings</h1>
        <p className="text-muted-foreground">The Culture Setting. Sync the app with your life.</p>
      </div>
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
              <div className="space-y-2">
                  <Label htmlFor="phonetic-dictionary">Phonetic Dictionary</Label>
                  <p className="text-sm text-muted-foreground">Help voice-to-text recognize local names and places.</p>
                  <Textarea id="phonetic-dictionary" placeholder="e.g., Siobhan = shiv-awn" defaultValue="Siobhan = shiv-awn" />
              </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
              <Button>Save Localization Settings</Button>
          </CardFooter>
      </Card>
    </div>
  );
}
