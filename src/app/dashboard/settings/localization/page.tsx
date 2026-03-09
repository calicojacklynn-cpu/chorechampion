
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

export default function LocalizationSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Localization Settings</h1>
        <p className="text-muted-foreground">Sync QuestKind with your family's culture and region.</p>
      </div>
      <Card>
          <CardHeader>
              <CardTitle>Language & Region</CardTitle>
              <CardDescription>Customize the terminology and timing for your family.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
              <div className="space-y-2">
                  <Label htmlFor="localized-terminology">Localized Terminology</Label>
                  <p className="text-sm text-muted-foreground">Rename "Quests" to something that fits your family's vibe.</p>
                  <Input id="localized-terminology" defaultValue="Daily Quests" />
              </div>
                <div className="space-y-2">
                  <Label htmlFor="currency-standardization">Point Terminology</Label>
                  <p className="text-sm text-muted-foreground">Choose the name for reward points (e.g., Adventure Coins).</p>
                  <Input id="currency-standardization" defaultValue="Adventure Points" />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="time-zone">Time Zone Sync</Label>
                  <p className="text-sm text-muted-foreground">Synchronizes the "Daily Reset" of quests.</p>
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
    </div>
  );
}
