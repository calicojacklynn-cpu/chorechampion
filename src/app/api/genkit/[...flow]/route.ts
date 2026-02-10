import { nextHandler } from '@genkit-ai/next';

// This ensures the genkit instance is created and configured.
import '@/ai/genkit';

// This registers the flow with genkit, making it available via the API.
import '@/ai/flows/automated-chore-schedule-generation.ts';

// This exports the handler that will process requests for the flows.
export const { GET, POST } = nextHandler();
