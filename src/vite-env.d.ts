
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_INSPHIRE_API: string;
  readonly VITE_MS_CLIENT_ID: string;
  readonly VITE_MS_TENANT_ID: string;
  readonly VITE_MS_REDIRECT_URI: string;
  readonly VITE_EMAIL_RECIPIENT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
