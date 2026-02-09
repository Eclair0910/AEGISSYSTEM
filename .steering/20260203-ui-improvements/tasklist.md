# UI改善タスクリスト

## 完了したタスク

### サイドバー改善
- [x] Sidebar.tsx を簡素化
  - ロゴを "ILIS" + "SYSTEM" に変更
  - 不要な装飾要素を削除
  - シンプルなコンポーネント構造に変更
- [x] Sidebar.scss を更新
  - 余分なボーダーを削除
  - VSCode風ホバーエフェクトを実装
  - アクティブ状態をシンプル化
  - 幅を 280px → 220px に変更

### ウィンドウコントロール改善
- [x] WindowControls.tsx を更新
  - タイトルを "ILIS System" に変更
- [x] WindowControls.scss を更新
  - ボーダーを完全に削除
  - VSCode風ホバーエフェクトを実装
  - 閉じるボタンを赤色 (#e81123) に設定

### 背景パターン改善
- [x] PNG生成スクリプトを作成 (generate-patterns-v2.js)
- [x] ドーナツ型パターンを生成
  - pattern-1-v2.png (外側: 750-850)
  - pattern-2-v2.png (中間: 450-550)
  - pattern-3-v2.png (内側: 200-350)
- [x] pattern-1-v3.png を生成 (ランダム弧配置)
  - generate-pattern-1-v3.js スクリプト作成
  - 非対称なSFスタイルのランダム弧配置
  - 対称なメモリ目盛り（72本、6本ごとに長い）
- [x] pattern-4.png を生成（対向1/6弧）
- [x] CyberBackground.tsx を更新
  - PNG参照に変更
  - 4層構成（pattern-1-v3, pattern-2-v2, pattern-4, pattern-3-v2）
- [x] CyberBackground.scss を更新
  - 重いフィルターを削除
  - サイズを調整して重ならないように設定

### 新規ページ作成
- [x] System Info ページ
  - タブ切り替え（Overview/Hardware/Storage）
  - サマリーカード
  - リフレッシュボタン
- [x] Event Log ページ
  - 検索ボックス
  - レベル別フィルタリング
  - 展開可能なイベント詳細
  - クリック可能なサマリーカード
- [x] Disk Analyzer ページ
  - ドライブ一覧（選択可能）
  - ファイルタイプ別使用量分析
  - 大容量ファイルリスト
  - サマリーセクション

### ページデザイン統一
- [x] page-header mixin を追加
  - 区切り線付きページタイトル
  - 全ページで共通のスタイル
- [x] コンテンツ幅を統一（max-width: 1400px）
  - Main, Performance, SystemInfo, EventLog, DiskAnalyzer, Test

### 設定修正
- [x] tsconfig.json を更新
  - JSX設定を追加
  - DOM型定義を追加

### ドキュメント更新
- [x] functional-design.md を更新
  - 新規ページ（2.4-2.6）を追加
  - コンポーネント階層を更新（4層背景、6ナビ項目）
  - 画面遷移図を更新
  - 背景パターン仕様を更新
  - アニメーション仕様を更新
- [x] development-guidelines.md を更新
  - ページヘッダールールを追加
  - コンテンツ幅ルールを追加

### セキュリティ強化
- [x] インターネットアクセス禁止ポリシーをドキュメントに追加
  - architecture.md に禁止ポリシーと強制設定を追加
  - product-requirements.md に NFR-005 を追加
- [x] コードベースでインターネットアクセスを検索
  - fetch, axios, WebSocket, 外部URL: 該当なし
  - CDN, 外部フォント: 該当なし
- [x] mainWindow.ts にインターネットブロックコードを追加
  - will-navigate イベントで外部URLをブロック
  - setWindowOpenHandler で新規ウィンドウをブロック
- [x] splashWindow.ts にインターネットブロックコードを追加
  - 同様のセキュリティ設定を適用

## 保留タスク

なし

## 備考

- 既存のPNGファイル (pattern-1.png, pattern-2.png, pattern-3.png) は保持
- canvas パッケージを devDependencies に追加済み
- pattern-1-v3.png: ランダム弧配置だが、メモリ目盛り部分のみ対称
