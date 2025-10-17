import { z } from 'zod';
import dotenv from 'dotenv';

// dotenv must be used for build time variables, i.e. process.env variables,
// because vite doesn't load them automatically.
dotenv.config();

const envSchema = z.object({
  PUBLIC_FOLDER_PREFIX: z.string()
});

// Parse process.env and throw if missing/invalid
const env = envSchema.parse(process.env);

// Now these are fully typed
export const PUBLIC_FOLDER_PREFIX = env.PUBLIC_FOLDER_PREFIX;
