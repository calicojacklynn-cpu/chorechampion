"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useSchedule } from "@/app/context/ScheduleContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { ListTodo, User, Calendar as CalendarIcon } from "lucide-react";

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { schedule } = useSchedule();

  const selectedDayString = date ? format(date, "EEEE") : "";
  const choresForSelectedDay = schedule.filter(
    (chore) => chore.day.toLowerCase() === selectedDayString.toLowerCase()
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
          <CalendarIcon className="h-8 w-8 text-muted-foreground" />
          Chore Calendar
        </h1>
        <p className="text-muted-foreground">
          View your AI-generated chore schedule at a glance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md"
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>
              Chores for {date ? format(date, "PPP") : "Today"}
            </CardTitle>
            <CardDescription>
              A list of what needs to get done on the selected day.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {choresForSelectedDay.length > 0 ? (
              choresForSelectedDay.map((chore, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <ListTodo className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold">{chore.choreName}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{chore.championName}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-full min-h-[150px] items-center justify-center">
                <p className="text-muted-foreground">
                  No chores scheduled for this day.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
