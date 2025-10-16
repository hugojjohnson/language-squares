// import { nodeEnvSchema } from './node-env.ts';
import { loadEnv } from 'vite';
import { z } from 'zod';

export const nodeEnvSchema = z.object({
  // BACKEND_API_URL: z.url(),
  // NODE_ENV: z.enum(['development', 'production', 'test']),
});

const mode = process.env.NODE_ENV || 'development';
const env = loadEnv(mode, process.cwd(), '');

const parsed = nodeEnvSchema.safeParse(env);

if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    console.error(parsed.error.format());
    process.exit(1); // ❌ fail fast
}

console.log('✅ Node environment OK!');

export type NodeEnv = z.infer<typeof nodeEnvSchema>;