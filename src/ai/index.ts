'use server';

/**
 * @fileOverview This file contains all the Genkit AI logic for the application.
 * It initializes the Genkit instance, defines the AI flow for chore schedule generation,
 * and exports the necessary functions and types for use in the app.
 */

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'zod';
import { config } from 'dotenv';

// Initialize dotenv
config();

// Initialize the Genkit AI instance
const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});

// Define Zod schemas for input and output
const ChoreScheduleInputSchema = z.object({
  instructions: z
    .string()
    .describe(
      'The user\'s request in plain English. This can include champion names, chores, availability, and any other relevant details for creating a chore schedule.'
    ),
});
export type ChoreScheduleInput = z.infer<typeof ChoreScheduleInputSchema>;

const ChoreAssignmentSchema = z.object({
  day: z.string().optional().describe('For recurring weekly chores, the day of the week (e.g., "Monday").'),
  date: z.string().optional().describe('For single assignments, the specific date in YYYY-MM-DD format.'),
  championName: z.string().describe('The name of the champion assigned to the chore.'),
  choreName: z.string().describe('The name of the assigned chore.'),
});
export type ChoreAssignment = z.infer<typeof ChoreAssignmentSchema>;

const AutomatedChoreScheduleOutputSchema = z.object({
  schedule: z.array(ChoreAssignmentSchema).describe('The generated weekly chore schedule.'),
});
export type AutomatedChoreScheduleOutput = z.infer<typeof AutomatedChoreScheduleOutputSchema>;

// Define the Genkit prompt
const scheduleGenerationPrompt = ai.definePrompt({
  name: 'choreScheduleGenerationPrompt',
  input: { schema: ChoreScheduleInputSchema },
  output: { schema: AutomatedChoreScheduleOutputSchema },
  prompt: `You are an expert family organizer. Your task is to create a fair and balanced weekly chore schedule for a family based on the user's instructions.

The user will provide all the necessary information in a single block of text. This may include the names of the children (champions), the chores that need to be done, their frequency, champion availability, and any other rules or constraints.

Your goal is to parse all this information and generate a complete, fair, and balanced chore schedule for one full week (Monday to Sunday).

**User's Instructions:**
{{{instructions}}}

Based on the instructions above, generate the weekly chore schedule.
- Interpret all instructions, including names, chores, schedules, and rules.
- Distribute the workload as evenly and fairly as possible.
- Adhere strictly to any specified availabilities or constraints.
- If information is missing, make reasonable assumptions (e.g., if a chore frequency isn't specified, assume weekly).
- The output must be a structured schedule for one full week.
- **CRITICAL:** Ensure each assignment in the output schedule has the \`day\` property set to the correct day of the week (e.g., 'Monday'), and the \`date\` property is omitted.
`,
});

// Define the Genkit flow
const generateChoreScheduleFlow = ai.defineFlow(
  {
    name: 'generateChoreScheduleFlow',
    inputSchema: ChoreScheduleInputSchema,
    outputSchema: AutomatedChoreScheduleOutputSchema,
  },
  async (input) => {
    const { output } = await scheduleGenerationPrompt(input);
    if (!output) {
      throw new Error('Failed to generate a schedule.');
    }
    return output;
  }
);

// Export a client-callable wrapper function for the flow
export async function generateChoreSchedule(
  input: ChoreScheduleInput
): Promise<AutomatedChoreScheduleOutput> {
  return generateChoreScheduleFlow(input);
}


// New Schemas and Flow for AI Scheduling a single chore

// New Schema for user-created calendar events
const CalendarEventSchema = z.object({
  title: z.string().describe('The title of the event.'),
  date: z.string().describe('The date of the event in YYYY-MM-DD format.'),
  startTime: z.string().optional().describe('The start time of the event in HH:mm 24-hour format.'),
  endTime: z.string().optional().describe('The end time of the event in HH:mm 24-hour format.'),
  type: z.enum(['appointment', 'task', 'other']).describe('The type of event.'),
  description: z.string().optional().describe("A description of the event.")
});

const AiScheduleChoreInputSchema = z.object({
  choreName: z.string().describe('The name of the chore to be scheduled.'),
  championNames: z.array(z.string()).describe('The names of the champions assigned to the chore.'),
  existingSchedule: z.array(ChoreAssignmentSchema).describe('The list of chores already scheduled for the week.'),
  calendarEvents: z.array(CalendarEventSchema).describe('A list of existing appointments, tasks, or other scheduled events that block out time.'),
  constraints: z.string().optional().describe('Any additional constraints for scheduling, like time of day or availability.'),
  currentDate: z.string().describe('The current date in YYYY-MM-DD format to use as a reference.'),
});
export type AiScheduleChoreInput = z.infer<typeof AiScheduleChoreInputSchema>;

const AiScheduleChoreOutputSchema = z.object({
  assignments: z.array(ChoreAssignmentSchema).describe('The suggested chore assignment(s).'),
});
export type AiScheduleChoreOutput = z.infer<typeof AiScheduleChoreOutputSchema>;

const aiScheduleChorePrompt = ai.definePrompt({
  name: 'aiScheduleChorePrompt',
  input: { schema: AiScheduleChoreInputSchema },
  output: { schema: AiScheduleChoreOutputSchema },
  prompt: `You are an intelligent scheduler for a family. Your task is to schedule a single new chore for one or more "champions" (children) while considering their existing schedules and any other constraints.

**Goal:** Find the best specific date within the next 365 days for the new chore and return the new assignment with a \`date\` field.

**Inputs:**
- New Chore: {{{choreName}}}
- Champions to assign it to: {{{json championNames}}}
- Existing Weekly Chore Schedule (recurring chores): {{{json existingSchedule}}}
- Existing Calendar Events (Appointments, etc.): {{{json calendarEvents}}}
- Additional Constraints: {{{constraints}}}
- Reference Date: Today's date is {{{currentDate}}}.

**Instructions:**
1.  **IMPORTANT**: First, review the 'Existing Calendar Events' to identify any specific dates or times that are already blocked for the champions. These events take precedence.
2.  Analyze the 'Existing Weekly Chore Schedule' to understand the recurring weekly workload for each champion.
3.  Consider the 'Additional Constraints'. For example, if the constraint says "after 4pm on a weekday", avoid scheduling during typical school hours.
4.  Based on all of the above, find the most suitable **specific date** for the new chore. This date can be any time within the next 365 days from the provided reference date. Prioritize finding the earliest available slot that respects all constraints.
5.  Create assignment objects for the new chore for each specified champion on the chosen date.
6.  **CRITICAL:** Ensure each assignment in the output has the \`date\` property set to the chosen date in 'YYYY-MM-DD' format. The \`day\` property should be omitted for these single assignments.
7.  Return ONLY the new assignment(s) in the 'assignments' array. Do not return the existing schedule.
`,
});

const aiScheduleChoreFlow = ai.defineFlow(
  {
    name: 'aiScheduleChoreFlow',
    inputSchema: AiScheduleChoreInputSchema,
    outputSchema: AiScheduleChoreOutputSchema,
  },
  async (input) => {
    const { output } = await aiScheduleChorePrompt(input);
    if (!output) {
      throw new Error('Failed to generate a schedule suggestion.');
    }
    return output;
  }
);

// Export a client-callable wrapper function
export async function aiScheduleChore(
  input: AiScheduleChoreInput
): Promise<AiScheduleChoreOutput> {
  return aiScheduleChoreFlow(input);
}


// New Schemas and Flow for AI Event Creation

const AiCalendarEventSchema = z.object({
  title: z.string().describe('The title of the event.'),
  date: z.string().describe('The date of the event in YYYY-MM-DD format.'),
  startTime: z.string().optional().describe('The start time of the event in HH:mm 24-hour format.'),
  endTime: z.string().optional().describe('The end time of the event in HH:mm 24-hour format.'),
  type: z.enum(['appointment', 'task', 'other']).describe('The type of event.'),
  description: z.string().optional().describe("A description of the event.")
});

const AiCreateEventsInputSchema = z.object({
  instructions: z.string().describe('The natural language instructions for the event(s) to create.'),
  currentDate: z.string().describe('The current date in YYYY-MM-DD format, to be used as a reference point for creating events for the current week.'),
});
export type AiCreateEventsInput = z.infer<typeof AiCreateEventsInputSchema>;

const AiCreateEventsOutputSchema = z.object({
  events: z.array(AiCalendarEventSchema).describe('The array of generated calendar events.'),
});
export type AiCreateEventsOutput = z.infer<typeof AiCreateEventsOutputSchema>;


const aiCreateEventsPrompt = ai.definePrompt({
  name: 'aiCreateEventsPrompt',
  input: { schema: AiCreateEventsInputSchema },
  output: { schema: AiCreateEventsOutputSchema },
  prompt: `You are an intelligent calendar assistant. Your task is to create a list of calendar events based on a user's natural language instructions.

**Goal:** Parse the user's request and generate all occurrences of the described events. You should handle complex recurring events and stopping conditions.

**Reference Date:** Today's date is {{{currentDate}}}. Use this to determine the start date for recurring events unless otherwise specified.

**Instructions:**
1.  Read the user's instructions carefully.
2.  Identify the event title, who it's for, days of the week, times, and recurrence pattern (e.g., "every weekday", "daily").
3.  Look for any stopping conditions or end dates, such as "until August 1st" or "for 3 weeks" or "summer break starts...". You must accurately calculate all occurrences up to this stop date.
4.  Generate a separate event object for EACH occurrence of the event. For example, "School every weekday from 8am to 3pm until June 15th" must create an event for every single weekday between the reference date and June 15th. Do not summarize or group them.
5.  If no end date is specified for a recurring event, generate events for the next 4 weeks by default.
6.  Assume a default event type of 'other' if not specified.
7.  **CRITICAL:** Ensure all dates in the output are in the 'YYYY-MM-DD' format.
8.  **CRITICAL:** Ensure all times are in the 'HH:mm' 24-hour format.
9.  Return all generated events in the 'events' array.

**User's Instructions:**
{{{instructions}}}
`,
});

const aiCreateEventsFlow = ai.defineFlow(
  {
    name: 'aiCreateEventsFlow',
    inputSchema: AiCreateEventsInputSchema,
    outputSchema: AiCreateEventsOutputSchema,
  },
  async (input) => {
    const { output } = await aiCreateEventsPrompt(input);
    if (!output) {
      throw new Error('Failed to generate events from the instructions.');
    }
    return output;
  }
);

// Export a client-callable wrapper function
export async function aiCreateEvents(
  input: AiCreateEventsInput
): Promise<AiCreateEventsOutput> {
  return aiCreateEventsFlow(input);
}
