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

export default function ChampionLocalizationSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Localization Settings</h1>
        <p className="text-muted-foreground">View your family's language and region settings.</p>
      </div>
      <Card>
          <CardHeader>
              <CardTitle>Language & Region</CardTitle>
              <CardDescription>These settings are managed by your parent or guardian.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
              <div className="space-y-2">
                  <Label htmlFor="localized-terminology">What "Chores" are called</Label>
                  <Input id="localized-terminology" defaultValue="Daily Quests" disabled />
              </div>
                <div className="space-y-2">
                  <Label htmlFor="currency-standardization">What "Points" are called</Label>
                  <Input id="currency-standardization" defaultValue="Champion Coins" disabled />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="time-zone">Family Time Zone</Label>
                    <Select defaultValue="cst" disabled>
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
      </Card>
    </div>
  );
}
