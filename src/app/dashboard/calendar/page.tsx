'use client';

import { useState, useMemo } from "react";
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
import { AiAddEventDialog } from "./AiAddEventDialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'monthly' | 'weekly'>('weekly');
  const { schedule, events } = useSchedule();

  const next = () => {
    setCurrentDate(add(currentDate, viewMode === 'monthly' ? { months: 1 } : { weeks: 1 }));
  };

  const prev = () => {
    setCurrentDate(sub(currentDate, viewMode === 'monthly' ? { months: 1 } : { weeks: 1 }));
  };

  const days = useMemo(() => {
    if (viewMode === 'monthly') {
      const firstDayOfMonth = startOfMonth(currentDate);
      const lastDayOfMonth = endOfMonth(currentDate);
      const startDate = startOfWeek(firstDayOfMonth);
      const endDate = endOfWeek(lastDayOfMonth);
      return eachDayOfInterval({ start: startDate, end: endDate });
    } else { // weekly view
      const startDate = startOfWeek(currentDate);
      const endDate = endOfWeek(currentDate);
      return eachDayOfInterval({ start: startDate, end: endDate });
    }
  }, [currentDate, viewMode]);

  const headerTitle = useMemo(() => {
    if (viewMode === 'monthly') {
      return format(currentDate, "MMMM yyyy");
    } else {
      const weekStart = startOfWeek(currentDate);
      const weekEnd = endOfWeek(currentDate);
      if (isSameMonth(weekStart, weekEnd)) {
        return `${format(weekStart, 'MMMM d')} - ${format(weekEnd, 'd, yyyy')}`;
      } else {
        return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
      }
    }
  }, [currentDate, viewMode]);


  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getEventsForDay = (day: Date) => {
    const dayString = format(day, "EEEE");
    const dateString = format(day, "yyyy-MM-dd");

    const choresForDay = schedule
      .filter((chore) => {
        // Match single-instance chores by specific date
        if (chore.date) {
            return chore.date === dateString;
        }
        // Match recurring chores by day of the week
        if (chore.day) {
            return chore.day.toLowerCase() === dayString.toLowerCase();
        }
        return false;
      })
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
        <div className="flex items-center gap-2">
          <AiAddEventDialog />
          <AddEventDialog />
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'monthly' | 'weekly')} className="w-auto">
            <TabsList className="h-9 p-1 bg-secondary text-secondary-foreground">
                <TabsTrigger value="weekly" className="h-7 px-3 text-xs data-[state=active]:bg-card-foreground data-[state=active]:text-card">Week</TabsTrigger>
                <TabsTrigger value="monthly" className="h-7 px-3 text-xs data-[state=active]:bg-card-foreground data-[state=active]:text-card">Month</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            <Button variant="default" size="sm" onClick={() => setCurrentDate(new Date())}>Today</Button>
            <CardTitle className="text-xl font-semibold">
              {headerTitle}
            </CardTitle>
            <Button variant="default" size="icon-sm" onClick={prev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="default" size="icon-sm" onClick={next}>
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
                  "p-2 border-r border-b flex flex-col overflow-hidden",
                  viewMode === 'weekly' ? 'h-[calc(100vh-20rem)]' : 'h-44',
                  viewMode === 'monthly' && !isSameMonth(day, currentDate) && "bg-muted/50 text-muted-foreground"
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
                          className="bg-primary p-1 rounded-sm text-[10px] leading-tight border border-black"
                        >
                          <p className="font-semibold truncate text-primary-foreground">
                            {event.choreName}
                          </p>
                          <p className="text-primary-foreground/90 truncate flex items-center gap-1">
                            <Users className="h-3 w-3" /> {event.championName}
                          </p>
                        </div>
                      );
                    }
                    // Render user-added events
                    return (
                      <div
                        key={index}
                        className="bg-primary p-1 rounded-sm text-[10px] leading-tight border border-black"
                      >
                        <p className="font-semibold truncate text-primary-foreground">
                          {event.title}
                        </p>
                        {event.startTime && (
                          <p className="text-primary-foreground/90 truncate flex items-center gap-1">
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
