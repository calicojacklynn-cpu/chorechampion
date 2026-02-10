import { nextHandler } from '@genkit-ai/next';

// This ensures the genkit instance is created and configured.
import '@/ai/genkit';
// This registers all the flows.
import '@/ai/flows';


// This exports the handler that will process requests for the flows.
export const { GET, POST } = nextHandler();
