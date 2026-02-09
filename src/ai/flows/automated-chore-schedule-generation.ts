'use server';

/**
 * @fileOverview This file defines a Genkit flow for automated chore schedule generation.
 *
 * It allows parents to automatically generate a chore schedule based on champion availability,
 * chore frequency, and house requirements.
 *
 * @interface AutomatedChoreScheduleInput - Defines the input schema for the automated chore schedule generation.
 * @interface AutomatedChoreScheduleOutput - Defines the output schema for the automated chore schedule generation.
 * @function generateAutomatedChoreSchedule - The main function to trigger the chore schedule generation flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChampionAvailabilitySchema = z.object({
  championName: z.string().describe('The name of the champion (child).'),
  availableDays: z
    .array(z.string())
    .describe("Days of the week the champion is available (e.g., ['Monday', 'Friday'])"),
});

const ChoreSchema = z.object({
  choreName: z.string().describe('The name of the chore.'),
  frequency: z
    .string()
    .describe('How often the chore should be done (e.g., "daily", "twice a week", "weekly").'),
});

export const AutomatedChoreScheduleInputSchema = z.object({
  championAvailability: z
    .array(ChampionAvailabilitySchema)
    .describe('A list of champions and their available days.'),
  choreList: z.array(ChoreSchema).describe('A list of chores to be scheduled.'),
  houseDetails: z
    .string()
    .optional()
    .describe(
      'Any specific details about the house or family that might affect scheduling (e.g., "We have two bathrooms", "The kids are in school from 8am to 3pm on weekdays").'
    ),
});
export type AutomatedChoreScheduleInput = z.infer<typeof AutomatedChoreScheduleInputSchema>;

const ChoreAssignmentSchema = z.object({
  day: z.string().describe('The day the chore is assigned for.'),
  championName: z.string().describe('The name of the champion assigned to the chore.'),
  choreName: z.string().describe('The name of the assigned chore.'),
});

export const AutomatedChoreScheduleOutputSchema = z.object({
  schedule: z.array(ChoreAssignmentSchema).describe('The generated weekly chore schedule.'),
});
export type AutomatedChoreScheduleOutput = z.infer<typeof AutomatedChoreScheduleOutputSchema>;

export async function generateAutomatedChoreSchedule(
  input: AutomatedChoreScheduleInput
): Promise<AutomatedChoreScheduleOutput> {
  return generateAutomatedChoreScheduleFlow(input);
}

const scheduleGenerationPrompt = ai.definePrompt({
  name: 'choreScheduleGenerationPrompt',
  input: {schema: AutomatedChoreScheduleInputSchema},
  output: {schema: AutomatedChoreScheduleOutputSchema},
  prompt: `You are an expert family organizer. Your task is to create a fair and balanced weekly chore schedule for a family.

Consider the following information:

**Champions (the kids) and their availability:**
{{#each championAvailability}}
- {{championName}} is available on: {{#each availableDays}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.
{{/each}}

**Chores that need to be done:**
{{#each choreList}}
- {{choreName}} (Frequency: {{frequency}})
{{/each}}

**House Details & Constraints:**
{{{houseDetails}}}

Based on all this information, generate a weekly chore schedule.
- Be fair and distribute the workload evenly among the champions.
- Respect each champion's availability.
- Ensure all chores are scheduled according to their required frequency.
- The output should be a schedule for one full week (Monday to Sunday).
`,
});

const generateAutomatedChoreScheduleFlow = ai.defineFlow(
  {
    name: 'generateAutomatedChoreScheduleFlow',
    inputSchema: AutomatedChoreScheduleInputSchema,
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
