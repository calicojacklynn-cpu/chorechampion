import { nextHandler } from '@genkit-ai/next';

// This ensures the genkit instance is created and configured,
// and that all flows are registered.
import '@/ai/genkit';

// This exports the handler that will process requests for the flows.
export const { GET, POST } = nextHandler();
