/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_URL: string
  // 他の環境変数をここに追加できます
  // readonly VITE_APP_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
