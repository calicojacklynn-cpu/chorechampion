'use server';
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});

// Import flows to register them with the ai object.
import './flows/automated-chore-schedule-generation';
