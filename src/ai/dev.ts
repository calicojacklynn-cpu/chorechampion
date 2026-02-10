import { config } from 'dotenv';
config();

// This ensures the genkit instance is created and configured.
import '@/ai/genkit';
// This registers the flows.
import '@/ai/flows/automated-chore-schedule-generation';
