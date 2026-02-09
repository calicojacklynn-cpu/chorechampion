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
  availableDays: z.array(z.string()).describe('Days of the week the champion is available (e.g., [\