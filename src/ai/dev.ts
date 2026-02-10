import { config } from 'dotenv';
config();

// This ensures the genkit instance is created and configured, and all flows are registered.
import '@/ai/genkit';
