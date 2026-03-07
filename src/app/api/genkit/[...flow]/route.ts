// import { genkitHandler } from '@genkit-ai/next';
// 
// // This imports and registers all the flows and initializes Genkit.
// import '@/ai';
// 
// // This exports the handler that will process requests for the flows.
// export const { GET, POST } = genkitHandler();

export const GET = () => new Response('Genkit under maintenance');
export const POST = GET;
// Refreshing build cache
