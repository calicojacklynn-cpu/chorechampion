/**
 * @fileoverview This file serves as a central registry for all Genkit flows.
 * It initializes the Genkit instance and then imports all flow files,
 * ensuring they are registered correctly.
 */

// This ensures the genkit instance is created and configured.
import '@/ai/genkit';

// Import flows to register them.
import './automated-chore-schedule-generation';
