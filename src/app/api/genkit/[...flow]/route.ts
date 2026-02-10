import { nextHandler } from '@genkit-ai/next';

// This ensures the genkit instance is created and configured.
import '@/ai/genkit';
// This registers the flows. It must be imported before nextHandler is called.
import '@/ai/flows/automated-chore-schedule-generation';

// This exports the handler that will process requests for the flows.
export const { GET, POST } = nextHandler();
