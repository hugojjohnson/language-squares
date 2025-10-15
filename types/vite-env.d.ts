/// <reference types="vite/client" />

interface ViteTypeOptions {
  strictImportMetaEnv: unknown
}

// Much sadness: You have to update this in 2 places :(. ./check-vite-env.ts
declare interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
