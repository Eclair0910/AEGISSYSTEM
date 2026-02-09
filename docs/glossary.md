# ユビキタス言語定義

## 1. ドメイン用語

### システム監視関連

| 用語 | 定義 | コード上の表記 |
|------|------|---------------|
| CPU使用率 | プロセッサの稼働割合（0-100%） | `cpuUsage` |
| メモリ使用量 | RAMの使用バイト数 | `memoryUsed` |
| メモリ使用率 | RAMの使用割合（0-100%） | `memoryUsagePercent` |
| 総メモリ | システムの総RAM容量 | `memoryTotal` |
| 空きメモリ | 使用可能なRAM容量 | `memoryFree` |
| コア数 | CPUの物理/論理コア数 | `cpuCores` |
| システム情報 | CPU・メモリ等の統合情報 | `SystemInfo` |

### ウィンドウ関連

| 用語 | 定義 | コード上の表記 |
|------|------|---------------|
| フレームレス | OSネイティブ枠のないウィンドウ | `frameless` |
| 最小化 | ウィンドウをタスクバーに格納 | `minimize` |
| 最大化 | ウィンドウを画面全体に拡大 | `maximize` |
| 復元 | 最大化前のサイズに戻す | `restore` |
| 閉じる | ウィンドウを終了 | `close` |
| タイトルバー | ウィンドウ上部の操作領域 | `TitleBar` |
| ドラッグ領域 | ウィンドウ移動可能な領域 | `drag-region` |

## 2. UI/UX用語

### ページ・画面

| 用語 | 定義 | コード上の表記 |
|------|------|---------------|
| スプラッシュ画面 | 起動時のローディング画面 | `SplashPage` |
| メインページ | アプリのホーム画面 | `MainPage` |
| パフォーマンスページ | システム監視画面 | `PerformancePage` |
| ナビゲーション | ページ間移動のメニュー | `Navigation` |

### コンポーネント

| 用語 | 定義 | コード上の表記 |
|------|------|---------------|
| 円形プログレス | 円弧で進捗を表示するUI | `CircularProgress` |
| 歯車背景 | 回転する装飾的背景 | `GearBackground` |
| ウィンドウコントロール | 最小化等の操作ボタン群 | `WindowControls` |
| パフォーマンスチャート | 使用率のグラフ表示 | `PerformanceChart` |
| CPUモニター | CPU監視コンポーネント | `CpuMonitor` |
| メモリモニター | メモリ監視コンポーネント | `MemoryMonitor` |

### デザイン

| 用語 | 定義 | 説明 |
|------|------|------|
| SF的デザイン | サイバーパンク風のUI | ネオンカラー、グロー効果、幾何学模様 |
| グロー効果 | 発光するような視覚効果 | box-shadowによる実装 |
| プライマリカラー | メインの強調色 | シアン系（#00D9FF） |
| セカンダリカラー | 補助の強調色 | マゼンタ系（#FF00AA） |

## 3. 技術用語

### Electron

| 用語 | 定義 | 説明 |
|------|------|------|
| Main Process | Node.js環境で動作するメインプロセス | システムAPI、ウィンドウ管理 |
| Renderer Process | Chromiumで動作するレンダラプロセス | UIの描画、ユーザー操作 |
| Preload Script | 両プロセスの橋渡しスクリプト | contextBridgeでAPI公開 |
| IPC | プロセス間通信 | ipcMain, ipcRenderer |
| contextBridge | 安全なAPI公開機構 | Preloadで使用 |
| BrowserWindow | Electronのウィンドウオブジェクト | メイン/スプラッシュウィンドウ |

### React

| 用語 | 定義 | 説明 |
|------|------|------|
| コンポーネント | UIの構成要素 | 関数コンポーネントを使用 |
| Props | コンポーネントへの入力 | 読み取り専用 |
| State | コンポーネントの状態 | useStateで管理 |
| Hook | 状態・副作用を扱う関数 | use接頭辞 |
| Effect | 副作用処理 | useEffectで管理 |

### SCSS

| 用語 | 定義 | 説明 |
|------|------|------|
| 変数 | 再利用可能な値 | `$color-primary` |
| ミックスイン | 再利用可能なスタイルセット | `@mixin flex-center` |
| パーシャル | 分割されたSCSSファイル | `_variables.scss` |
| ネスト | 階層的なセレクタ記述 | `&__element` |

## 4. 英語・日本語対応表

### 一般用語

| 英語 | 日本語 | コード |
|------|--------|--------|
| Application | アプリケーション | `App` |
| Window | ウィンドウ | `Window` |
| Page | ページ | `Page` |
| Component | コンポーネント | `Component` |
| Button | ボタン | `Button` |
| Navigation | ナビゲーション | `Navigation` |
| Dashboard | ダッシュボード | `Dashboard` |

### 機能用語

| 英語 | 日本語 | コード |
|------|--------|--------|
| Splash | スプラッシュ | `Splash` |
| Loading | ローディング | `loading` |
| Progress | 進捗 | `progress` |
| Performance | パフォーマンス | `Performance` |
| Monitor | モニター/監視 | `Monitor` |
| Chart | チャート/グラフ | `Chart` |
| Usage | 使用量/使用率 | `usage` |

### 操作用語

| 英語 | 日本語 | コード |
|------|--------|--------|
| Minimize | 最小化 | `minimize` |
| Maximize | 最大化 | `maximize` |
| Restore | 復元 | `restore` |
| Close | 閉じる | `close` |
| Click | クリック | `click` |
| Hover | ホバー | `hover` |

### 状態用語

| 英語 | 日本語 | コード |
|------|--------|--------|
| Active | アクティブ | `active` |
| Disabled | 無効 | `disabled` |
| Loading | 読み込み中 | `isLoading` |
| Error | エラー | `error`, `hasError` |
| Success | 成功 | `success` |

## 5. コード命名規則

### 型名

| 概念 | 命名パターン | 例 |
|------|-------------|-----|
| データ型 | PascalCase | `SystemInfo`, `CpuInfo` |
| Props型 | [Component]Props | `TitleBarProps` |
| 状態型 | [State]State | `PerformanceState` |
| イベント型 | [Action]Event | `ClickEvent` |

### 変数名

| 概念 | 命名パターン | 例 |
|------|-------------|-----|
| 状態 | camelCase | `systemInfo`, `isLoading` |
| ハンドラ | handle[Action] | `handleClick`, `handleMinimize` |
| 真偽値 | is/has/can[状態] | `isMaximized`, `hasError` |
| 配列 | [名詞]s または [名詞]List | `items`, `historyList` |

### 関数名

| 種類 | 命名パターン | 例 |
|------|-------------|-----|
| 取得 | get[名詞] | `getSystemInfo` |
| 設定 | set[名詞] | `setWindowSize` |
| 変換 | format[名詞] | `formatBytes` |
| 検証 | validate[名詞] / is[状態] | `validateInput`, `isValid` |
| イベント | on[イベント] | `onClick`, `onLoad` |

### ファイル名

| 種類 | 命名パターン | 例 |
|------|-------------|-----|
| コンポーネント | PascalCase.tsx | `TitleBar.tsx` |
| フック | use[名詞].ts | `useSystemInfo.ts` |
| ユーティリティ | camelCase.ts | `formatters.ts` |
| 型定義 | camelCase.ts | `system.ts` |
| スタイル | [Component].scss | `TitleBar.scss` |
| パーシャル | _camelCase.scss | `_variables.scss` |

### IPCチャンネル名

| カテゴリ | 命名パターン | 例 |
|---------|-------------|-----|
| ウィンドウ | window:[action] | `window:minimize` |
| システム | system:[action] | `system:getInfo` |
| アプリ | app:[action] | `app:quit` |

```typescript
// IPCチャンネル定義例
export const IpcChannels = {
  // Window
  WINDOW_MINIMIZE: 'window:minimize',
  WINDOW_MAXIMIZE: 'window:maximize',
  WINDOW_CLOSE: 'window:close',

  // System
  SYSTEM_GET_INFO: 'system:getInfo',
  SYSTEM_START_MONITORING: 'system:startMonitoring',
  SYSTEM_STOP_MONITORING: 'system:stopMonitoring',
  SYSTEM_INFO_UPDATE: 'system:infoUpdate'
} as const;
```
