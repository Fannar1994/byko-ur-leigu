
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_INSPHIRE_API: string;
  // Add other environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
