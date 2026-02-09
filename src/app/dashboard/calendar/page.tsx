"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

export default function CalendarPage() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-2">
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Chore Calendar</CardTitle>
                        <CardDescription>View scheduled chores for the week and month.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="p-3 w-full"
                        />
                    </CardContent>
                </Card>
            </div>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Chores for {date ? date.toLocaleDateString() : 'Today'}</CardTitle>
                        <CardDescription>What's on the list for the selected day.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-96">
                        <p className="text-muted-foreground">No chores scheduled for this day.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
