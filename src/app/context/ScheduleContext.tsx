'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { format, addDays } from 'date-fns';
import type { ChoreAssignment } from '@/ai';

// Define a new type for general calendar events
export type CalendarEvent = {
  id: string;
  title: string;
  date: string; // "yyyy-MM-dd"
  startTime?: string;
  endTime?: string;
  type: 'appointment' | 'task' | 'other';
  description?: string;
};

type ScheduleContextType = {
  schedule: ChoreAssignment[];
  setSchedule: (schedule: ChoreAssignment[]) => void;
  events: CalendarEvent[];
  addEvent: (eventData: Omit<CalendarEvent, 'id'>) => void;
};

const ScheduleContext = createContext<ScheduleContextType | undefined>(
  undefined
);

// Create some realistic sample events for demonstration
const createSampleEvents = (): CalendarEvent[] => {
  const today = new Date();
  return [
    {
      id: 'event-1',
      title: 'Soccer Practice (Bella)',
      date: format(addDays(today, 2), 'yyyy-MM-dd'),
      startTime: '16:00',
      endTime: '17:30',
      type: 'appointment',
      description: 'At the community park.',
    },
    {
      id: 'event-2',
      title: 'Dentist Appointment (Alex)',
      date: format(addDays(today, 4), 'yyyy-MM-dd'),
      startTime: '10:00',
      endTime: '10:30',
      type: 'appointment',
    },
  ];
};

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const [schedule, setSchedule] = useState<ChoreAssignment[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>(createSampleEvents());

  const addEvent = useCallback((eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = { ...eventData, id: `event-${Date.now()}` };
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  }, []);

  return (
    <ScheduleContext.Provider
      value={{ schedule, setSchedule, events, addEvent }}
    >
      {children}
    </ScheduleContext.Provider>
  );
}

export function useSchedule() {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
}