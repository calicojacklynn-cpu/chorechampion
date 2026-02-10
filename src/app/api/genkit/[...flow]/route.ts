import { nextHandler } from '@genkit-ai/next';

// This registers all the flows and initializes Genkit.
import '@/ai/flows';

// This exports the handler that will process requests for the flows.
export const { GET, POST } = nextHandler();
