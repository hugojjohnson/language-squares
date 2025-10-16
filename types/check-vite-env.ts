import { z } from 'zod';
import { loadEnv } from 'vite';

// Vite provides the current mode (defaults to 'development')
const mode = process.env.NODE_ENV || 'development';
const env = loadEnv(mode, process.cwd(), ''); // load all env vars

// Much sadness: You have to update this in 2 places :(. ./vite-env.d.ts
export const viteEnvSchema = z.object({
  VITE_BACKEND_URL: z.url(),
  // VITE_FEATURE_FLAG: z.enum(['on', 'off']).default('off'),
});

// Validate
const parsed = viteEnvSchema.safeParse(env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.format());
  process.exit(1); // ❌ fail fast
}

console.log('✅ Vite environment OK!');


export type ViteEnv = z.infer<typeof viteEnvSchema>;
