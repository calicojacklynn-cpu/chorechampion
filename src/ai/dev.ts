import { config } from 'dotenv';
config();

// This ensures the genkit instance is created and configured.
import '@/ai/genkit';
// This registers all flows.
import '@/ai/flows';
