/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_PASS_TYPE_IDENTIFIER: string;
  readonly VITE_TEAM_IDENTIFIER: string;
  readonly VITE_GITHUB_PAGES: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.svg' {
  const content: string;
  export default content;
}
