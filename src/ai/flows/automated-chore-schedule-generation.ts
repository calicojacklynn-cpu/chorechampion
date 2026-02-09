'use server';

/**
 * @fileOverview This file defines a Genkit flow for automated chore schedule generation.
 *
 * It allows parents to automatically generate a chore schedule based on natural language instructions,
 * champion availability, chore frequency, and house requirements.
 *
 * @interface AutomatedChoreScheduleInput - Defines the input schema for the automated chore schedule generation.
 * @interface AutomatedChoreScheduleOutput - Defines the output schema for the automated chore schedule generation.
 * @function generateAutomatedChoreSchedule - The main function to trigger the chore schedule generation flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

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

const AutomatedChoreScheduleInputSchema = z.object({
  naturalLanguageInstructions: z
    .string()
    .optional()
    .describe(
      'Specific scheduling instructions in plain English (e.g., "Billy needs to take the trash out every night at 8pm", "The dog needs to be walked in the morning and evening").'
    ),
  championAvailability: z
    .array(ChampionAvailabilitySchema)
    .describe('A list of champions and their available days. This can be used in conjunction with or instead of natural language instructions.'),
  choreList: z.array(ChoreSchema).describe('A list of chores to be scheduled. This can be used in conjunction with or instead of natural language instructions.'),
  houseDetails: z
    .string()
    .optional()
    .describe(
      'Any general details about the house or family that might affect scheduling (e.g., "We have two bathrooms", "The kids are in school from 8am to 3pm on weekdays").'
    ),
});
export type AutomatedChoreScheduleInput = z.infer<typeof AutomatedChoreScheduleInputSchema>;

const ChoreAssignmentSchema = z.object({
  day: z.string().describe('The day the chore is assigned for.'),
  championName: z.string().describe('The name of the champion assigned to the chore.'),
  choreName: z.string().describe('The name of the assigned chore.'),
});

const AutomatedChoreScheduleOutputSchema = z.object({
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
  prompt: `You are an expert family organizer. Your task is to create a fair and balanced weekly chore schedule for a family based on the provided instructions.

Your primary goal is to interpret the "Specific Instructions" first. If provided, these natural language instructions take precedence over the structured availability and chore lists. Use the structured lists as supplementary information or as the primary source if no specific instructions are given.

**Specific Instructions (Priority):**
{{#if naturalLanguageInstructions}}
{{{naturalLanguageInstructions}}}
{{else}}
No specific natural language instructions provided. Use the lists below.
{{/if}}

**Champions (the kids) and their general availability:**
{{#if championAvailability}}
{{#each championAvailability}}
- {{championName}} is available on: {{#each availableDays}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.
{{/each}}
{{else}}
No champion availability list provided.
{{/if}}

**Chores that need to be done:**
{{#if choreList}}
{{#each choreList}}
- {{choreName}} (Frequency: {{frequency}})
{{/each}}
{{else}}
No chore list provided.
{{/if}}

**General House Details & Constraints:**
{{{houseDetails}}}

Based on all this information, generate a weekly chore schedule.
- **Prioritize the "Specific Instructions".** If it says "Billy takes out the trash every night", schedule that, even if the chore list has a different frequency.
- Be fair and distribute the workload evenly among the champions for any remaining/unspecified chores.
- Respect each champion's availability.
- Ensure all chores are scheduled according to their required frequency, unless overridden by specific instructions.
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
