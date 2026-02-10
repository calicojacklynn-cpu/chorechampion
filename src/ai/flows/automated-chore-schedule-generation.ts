'use server';

/**
 * @fileOverview This file defines a Genkit flow for automated chore schedule generation.
 *
 * It allows parents to automatically generate a chore schedule based on natural language instructions.
 *
 * @interface ChoreScheduleInput - Defines the input schema for the chore schedule generation.
 * @interface AutomatedChoreScheduleOutput - Defines the output schema for the chore schedule generation.
 * @function generateChoreSchedule - The main function to trigger the chore schedule generation flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

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

const AutomatedChoreScheduleOutputSchema = z.object({
  schedule: z.array(ChoreAssignmentSchema).describe('The generated weekly chore schedule.'),
});
export type AutomatedChoreScheduleOutput = z.infer<typeof AutomatedChoreScheduleOutputSchema>;

export async function generateChoreSchedule(
  input: ChoreScheduleInput
): Promise<AutomatedChoreScheduleOutput> {
  return generateAutomatedChoreScheduleFlow(input);
}

const scheduleGenerationPrompt = ai.definePrompt({
  name: 'choreScheduleGenerationPrompt',
  input: {schema: ChoreScheduleInputSchema},
  output: {schema: AutomatedChoreScheduleOutputSchema},
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

const generateAutomatedChoreScheduleFlow = ai.defineFlow(
  {
    name: 'generateAutomatedChoreScheduleFlow',
    inputSchema: ChoreScheduleInputSchema,
    outputSchema: AutomatedChoreScheduleOutputSchema,
  },
  async (input) => {
    const {output} = await scheduleGenerationPrompt(input);
    if (!output) {
      throw new Error('Failed to generate a schedule.');
    }
    return output;
  }
);
