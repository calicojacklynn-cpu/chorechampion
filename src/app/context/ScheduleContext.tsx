'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { ChoreAssignment } from '@/ai';

type ScheduleContextType = {
  schedule: ChoreAssignment[];
  setSchedule: (schedule: ChoreAssignment[]) => void;
};

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const [schedule, setSchedule] = useState<ChoreAssignment[]>([]);

  return (
    <ScheduleContext.Provider value={{ schedule, setSchedule }}>
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
