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
  day: z.string().describe('The day the chore is assigned for.'),
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

const AiScheduleChoreInputSchema = z.object({
  choreName: z.string().describe('The name of the chore to be scheduled.'),
  championNames: z.array(z.string()).describe('The names of the champions assigned to the chore.'),
  existingSchedule: z.array(ChoreAssignmentSchema).describe('The list of chores already scheduled for the week.'),
  constraints: z.string().optional().describe('Any additional constraints for scheduling, like time of day or availability.'),
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
  prompt: `You are an intelligent scheduler for a family. Your task is to schedule a single new chore for one or more "champions" (children) while considering their existing weekly chore schedule and any other constraints.

**Goal:** Find the best day (Monday-Sunday) for the new chore and return the new assignment.

**Inputs:**
- New Chore: {{{choreName}}}
- Champions to assign it to: {{{json championNames}}}
- Existing Weekly Schedule: {{{json existingSchedule}}}
- Additional Constraints: {{{constraints}}}

**Instructions:**
1. Analyze the existing schedule to see which days each champion is already busy.
2. Consider the additional constraints. For example, if the constraint says "after 4pm", this implies a weekday and you should avoid scheduling it during typical school hours. If no constraint is given, simply find the day with the least number of existing chores for the assigned champions.
3. Choose the most suitable day of the week (e.g., "Monday", "Tuesday", etc.) for the new chore.
4. Create assignment objects for the new chore for each specified champion on the chosen day.
5. Return ONLY the new assignment(s) in the 'assignments' array. Do not return the existing schedule.
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
