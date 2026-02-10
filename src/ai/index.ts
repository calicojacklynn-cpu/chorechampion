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
export const ai = genkit({
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
