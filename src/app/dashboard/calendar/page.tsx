"use client"

import { useState } from 'react';
import { format } from 'date-fns';
import { useSchedule } from '@/app/context/ScheduleContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { ListTodo, User } from 'lucide-react';

export default function CalendarPage() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const { schedule } = useSchedule();

    const selectedDayString = date ? format(date, 'EEEE') : '';
    const choresForSelectedDay = schedule.filter(
        (chore) => chore.day.toLowerCase() === selectedDayString.toLowerCase()
    );

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Chore Calendar</CardTitle>
                    <CardDescription>View scheduled chores from the AI Scheduler.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                    />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Chores for {date ? format(date, 'PPP') : 'Today'}</CardTitle>
                    <CardDescription>What's on the list for the selected day.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col space-y-4 min-h-96">
                    {choresForSelectedDay.length > 0 ? (
                        choresForSelectedDay.map((chore, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
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
                        <div className="flex items-center justify-center grow">
                            <p className="text-muted-foreground">No chores scheduled for this day.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
