# AEGISSystem

リアルタイムシステムモニタリングアプリケーション

## 概要

AEGISSystemは、Electron + React + TypeScriptで構築された近未来SF風のシステムモニターアプリケーションです。
コンピュータのメモリ使用量、CPU使用率などをリアルタイムで視覚的に確認できます。

## 機能

- **リアルタイムモニタリング**: メモリとCPUの使用状況を1秒間隔で更新
- **近未来SF的なUI**: サイバーブルーとネオングローを基調としたデザイン
- **円形スプラッシュ画面**: 起動時に美しいローディングアニメーション
- **カスタムウィンドウコントロール**: 最小化、最大化、閉じるボタン
- **回転する歯車背景**: アニメーションする背景エフェクト
- **フレームレスウィンドウ**: 独自のUIデザイン

## 技術スタック

- **Electron** - デスクトップアプリケーションフレームワーク
- **React** - UIライブラリ
- **TypeScript** - 型安全な開発
- **Vite** - 高速ビルドツール
- **SCSS** - スタイリング
- **systeminformation** - システム情報取得

## 必要要件

- Node.js 20.x 以上
- npm 10.x 以上

## インストール

```bash
# 依存関係のインストール
npm install
```

## 開発

```bash
# Electron開発モード（デスクトップアプリ）
npm run dev:electron

# ブラウザプレビューモード（Webブラウザで確認）
npm run dev:browser
```

ブラウザモードは `http://localhost:5173` で起動します。

## ビルド

### Electronアプリケーションのビルド

```bash
# プロダクションビルド
npm run build

# アプリケーションのパッケージング
npm run package

# プラットフォーム別パッケージング
npm run package:win    # Windows
npm run package:mac    # macOS
npm run package:linux  # Linux
```

### ブラウザ版のビルド（GitHub Pages用）

```bash
# ブラウザ版のビルド
npm run build:browser
```

ビルド成果物は `dist-browser/` に出力されます。

## デモ

GitHub Pagesでデモ版を公開しています。

**[デモサイトを見る](https://eclair0910.github.io/AEGISSYSTEM/)**

> ⚠️ 注意: ブラウザ版では一部のシステム情報取得機能が制限されています。完全な機能を利用するにはElectronアプリをダウンロードしてください。

## プロジェクト構造

```
AEGISSystem/
├── src/
│   ├── main/              # Electronメインプロセス
│   ├── renderer/          # Reactレンダラープロセス
│   │   ├── splash/        # スプラッシュ画面
│   │   ├── main/          # メインアプリケーション
│   │   └── shared/        # 共通リソース
│   └── types/             # TypeScript型定義
├── public/                # 静的ファイル
└── dist/                  # ビルド出力
```

## ライセンス

MIT

## 作成者

AEGISSystem Team
