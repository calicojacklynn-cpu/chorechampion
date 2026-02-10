"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  add,
  sub,
} from "date-fns";
import { useSchedule } from "@/app/context/ScheduleContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AddEventDialog } from "./AddEventDialog";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { schedule, events } = useSchedule();

  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  const startDate = startOfWeek(firstDayOfMonth);
  const endDate = endOfWeek(lastDayOfMonth);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentDate(add(currentDate, { months: 1 }));
  const prevMonth = () => setCurrentDate(sub(currentDate, { months: 1 }));

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getEventsForDay = (day: Date) => {
    const dayString = format(day, "EEEE");
    const dateString = format(day, "yyyy-MM-dd");

    const choresForDay = schedule
      .filter((chore) => chore.day.toLowerCase() === dayString.toLowerCase())
      .map((chore) => ({ ...chore, eventType: "chore" }));

    const otherEvents = events
      .filter((event) => event.date === dateString)
      .map((event) => ({ ...event, eventType: event.type }));

    // Combine and sort by start time if available
    const allEvents = [...choresForDay, ...otherEvents].sort((a: any, b: any) => {
        if (a.startTime && b.startTime) {
            return a.startTime.localeCompare(b.startTime);
        }
        if (a.startTime) return -1;
        if (b.startTime) return 1;
        return 0;
    });
    return allEvents;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
            <CalendarIcon className="h-8 w-8 text-muted-foreground" />
            Family Calendar
          </h1>
          <p className="text-muted-foreground">
            A monthly view of your family's schedule and chores.
          </p>
        </div>
        <AddEventDialog />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
          <CardTitle className="text-xl font-semibold">
            {format(currentDate, "MMMM yyyy")}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-7 border-b">
            {weekDays.map((day) => (
              <div
                key={day}
                className="p-2 text-center text-sm font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {days.map((day) => (
              <div
                key={day.toString()}
                className={cn(
                  "h-44 p-2 border-r border-b flex flex-col overflow-hidden",
                  !isSameMonth(day, currentDate) &&
                    "bg-muted/50 text-muted-foreground"
                )}
              >
                <time
                  dateTime={format(day, "yyyy-MM-dd")}
                  className={cn(
                    "flex items-center justify-center h-6 w-6 rounded-full text-sm",
                    isToday(day) && "bg-primary text-primary-foreground font-bold"
                  )}
                >
                  {format(day, "d")}
                </time>
                <div className="flex-grow overflow-y-auto text-xs space-y-1 mt-1 -mx-1 px-1">
                  {getEventsForDay(day).map((event: any, index) => {
                    if (event.eventType === "chore") {
                      return (
                        <div
                          key={index}
                          className="bg-primary/20 p-1 rounded-sm text-[10px] leading-tight"
                        >
                          <p className="font-semibold truncate text-primary">
                            {event.choreName}
                          </p>
                          <p className="text-primary/90 truncate flex items-center gap-1">
                            <Users className="h-3 w-3" /> {event.championName}
                          </p>
                        </div>
                      );
                    }
                    // Render user-added events
                    return (
                      <div
                        key={index}
                        className="bg-accent/30 p-1 rounded-sm text-[10px] leading-tight"
                      >
                        <p className="font-semibold truncate text-accent-foreground">
                          {event.title}
                        </p>
                        {event.startTime && (
                          <p className="text-accent-foreground/90 truncate flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {event.startTime}{" "}
                            {event.endTime && `- ${event.endTime}`}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}