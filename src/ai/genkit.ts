import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// This ensures the flow is registered when this module is imported.
import '@/ai/flows/automated-chore-schedule-generation';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});
