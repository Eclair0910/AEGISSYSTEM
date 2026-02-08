# リポジトリ構造定義書

## 1. 全体構造

```
AEGISSystem/
├── .steering/                    # 作業単位のドキュメント
│   └── [YYYYMMDD]-[タイトル]/
│       ├── requirements.md
│       ├── design.md
│       └── tasklist.md
├── docs/                         # 永続的ドキュメント
│   ├── product-requirements.md
│   ├── functional-design.md
│   ├── architecture.md
│   ├── repository-structure.md
│   ├── development-guidelines.md
│   ├── glossary.md
│   └── images/                   # ドキュメント用画像
├── src/                          # ソースコード
│   ├── main/                     # Electron Main Process
│   ├── preload/                  # Preload Scripts
│   └── renderer/                 # React Application
├── assets/                       # 静的アセット
├── dist/                         # ビルド出力
├── release/                      # パッケージ出力
├── node_modules/                 # 依存関係
├── package.json
├── tsconfig.json
├── tsconfig.renderer.json
├── vite.config.ts
├── electron-builder.json
├── .gitignore
├── .eslintrc.js
├── .prettierrc
└── CLAUDE.md                     # プロジェクトメモリ
```

## 2. ディレクトリ詳細

### 2.1 src/main/ - Main Process

```
src/main/
├── main.ts                       # エントリーポイント
├── window/
│   ├── mainWindow.ts            # メインウィンドウ管理
│   └── splashWindow.ts          # スプラッシュウィンドウ管理
├── ipc/
│   ├── handlers.ts              # IPCハンドラー登録
│   └── channels.ts              # チャンネル名定義
├── services/
│   └── systemInfo.ts            # システム情報取得サービス
└── utils/
    └── paths.ts                 # パスユーティリティ
```

| ファイル/ディレクトリ | 役割 |
|---------------------|------|
| main.ts | アプリケーションのエントリーポイント |
| window/ | ウィンドウ生成・管理 |
| ipc/ | IPC通信のハンドラーとチャンネル定義 |
| services/ | システム情報など外部API連携 |
| utils/ | 共通ユーティリティ |

### 2.2 src/preload/ - Preload Scripts

```
src/preload/
├── preload.ts                    # メインpreload
├── api/
│   ├── window.ts                # ウィンドウ操作API
│   └── system.ts                # システム情報API
└── types.d.ts                   # 型定義（window拡張）
```

| ファイル/ディレクトリ | 役割 |
|---------------------|------|
| preload.ts | contextBridgeによるAPI公開 |
| api/ | 機能別API定義 |
| types.d.ts | グローバル型定義 |

### 2.3 src/renderer/ - React Application

```
src/renderer/
├── index.html                    # HTMLエントリーポイント
├── main.tsx                      # Reactエントリーポイント
├── App.tsx                       # ルートコンポーネント
├── components/                   # 共通コンポーネント
│   ├── layout/
│   │   ├── TitleBar/
│   │   │   ├── TitleBar.tsx
│   │   │   └── TitleBar.scss
│   │   ├── Navigation/
│   │   │   ├── Navigation.tsx
│   │   │   └── Navigation.scss
│   │   └── PageContainer/
│   │       ├── PageContainer.tsx
│   │       └── PageContainer.scss
│   ├── common/
│   │   ├── GearBackground/
│   │   │   ├── GearBackground.tsx
│   │   │   └── GearBackground.scss
│   │   ├── CircularProgress/
│   │   │   ├── CircularProgress.tsx
│   │   │   └── CircularProgress.scss
│   │   └── WindowControls/
│   │       ├── WindowControls.tsx
│   │       └── WindowControls.scss
│   └── charts/
│       ├── PerformanceChart/
│       │   ├── PerformanceChart.tsx
│       │   └── PerformanceChart.scss
│       └── index.ts
├── pages/                        # ページコンポーネント
│   ├── Splash/
│   │   ├── SplashPage.tsx
│   │   └── SplashPage.scss
│   ├── Main/
│   │   ├── MainPage.tsx
│   │   └── MainPage.scss
│   └── Performance/
│       ├── PerformancePage.tsx
│       ├── PerformancePage.scss
│       └── components/
│           ├── CpuMonitor.tsx
│           └── MemoryMonitor.tsx
├── hooks/                        # カスタムフック
│   ├── useSystemInfo.ts
│   ├── useWindowControls.ts
│   └── index.ts
├── styles/                       # グローバルスタイル
│   ├── _variables.scss          # SCSS変数
│   ├── _mixins.scss             # SCSSミックスイン
│   ├── _animations.scss         # アニメーション定義
│   ├── _reset.scss              # CSSリセット
│   └── global.scss              # グローバルスタイル
├── types/                        # 型定義
│   ├── system.ts
│   └── index.ts
└── utils/                        # ユーティリティ
    ├── formatters.ts
    └── index.ts
```

| ディレクトリ | 役割 |
|-------------|------|
| components/ | 再利用可能なUIコンポーネント |
| pages/ | ページ単位のコンポーネント |
| hooks/ | カスタムReactフック |
| styles/ | グローバルSCSSファイル |
| types/ | TypeScript型定義 |
| utils/ | ユーティリティ関数 |

### 2.4 assets/ - 静的アセット

```
assets/
├── icons/
│   ├── icon.ico                 # Windows用アイコン
│   ├── icon.icns                # macOS用アイコン
│   └── icon.png                 # Linux用アイコン
├── images/
│   └── logo.svg                 # ロゴ画像
└── fonts/                       # カスタムフォント（必要に応じて）
```

## 3. ファイル命名規則

### TypeScript/TSX

| 種類 | 規則 | 例 |
|------|------|-----|
| コンポーネント | PascalCase | `TitleBar.tsx` |
| フック | camelCase（use接頭辞） | `useSystemInfo.ts` |
| ユーティリティ | camelCase | `formatters.ts` |
| 型定義 | camelCase | `system.ts` |
| 定数 | camelCase or UPPER_SNAKE | `channels.ts` |

### SCSS

| 種類 | 規則 | 例 |
|------|------|-----|
| コンポーネント用 | コンポーネント名と同名 | `TitleBar.scss` |
| パーシャル | アンダースコア接頭辞 | `_variables.scss` |
| グローバル | 用途を示す名前 | `global.scss` |

### ディレクトリ

| 種類 | 規則 | 例 |
|------|------|-----|
| コンポーネント | PascalCase | `TitleBar/` |
| 機能グループ | camelCase | `layout/`, `common/` |
| ページ | PascalCase | `Main/`, `Performance/` |

## 4. コンポーネント構造

### 標準的なコンポーネントディレクトリ

```
ComponentName/
├── ComponentName.tsx            # メインコンポーネント
├── ComponentName.scss           # スタイル
├── ComponentName.test.tsx       # テスト（オプション）
├── components/                  # サブコンポーネント（オプション）
│   └── SubComponent.tsx
└── index.ts                     # エクスポート（オプション）
```

### index.ts によるエクスポート

```typescript
// components/common/index.ts
export { GearBackground } from './GearBackground/GearBackground';
export { CircularProgress } from './CircularProgress/CircularProgress';
export { WindowControls } from './WindowControls/WindowControls';
```

## 5. ビルド出力構造

### dist/ - 開発ビルド

```
dist/
├── main/
│   ├── main.js
│   └── preload.js
└── renderer/
    ├── index.html
    ├── assets/
    │   ├── index-[hash].js
    │   └── index-[hash].css
    └── ...
```

### release/ - パッケージ出力

```
release/
├── win-unpacked/                # Windows展開版
├── AEGISSystem-Setup-x.x.x.exe   # Windowsインストーラー
├── mac/                         # macOS版
├── AEGISSystem-x.x.x.dmg         # macOSディスクイメージ
└── linux-unpacked/              # Linux展開版
```

## 6. 設定ファイル

| ファイル | 用途 |
|---------|------|
| package.json | npm設定・スクリプト定義 |
| tsconfig.json | Main/Preload用TypeScript設定 |
| tsconfig.renderer.json | Renderer用TypeScript設定 |
| vite.config.ts | Viteビルド設定 |
| electron-builder.json | パッケージング設定 |
| .eslintrc.js | ESLint設定 |
| .prettierrc | Prettier設定 |
| .gitignore | Git除外設定 |

## 7. 除外ファイル（.gitignore）

```gitignore
# Dependencies
node_modules/

# Build output
dist/
release/

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Environment
.env
.env.local

# Cache
.cache/
.eslintcache
```
