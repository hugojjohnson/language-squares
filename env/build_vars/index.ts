import { z } from 'zod';

// Define your schema for env vars
const envSchema = z.object({
  PUBLIC_FOLDER_PREFIX: z.string().default("")
});

// Parse process.env and throw if missing/invalid
const env = envSchema.parse(process.env);

// Now these are fully typed
export const PUBLIC_FOLDER_PREFIX = env.PUBLIC_FOLDER_PREFIX;
