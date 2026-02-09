# UI改善設計書

## 1. サイドバー設計

### 変更前後の比較

| 要素 | 変更前 | 変更後 |
|------|--------|--------|
| 幅 | 280px | 220px |
| ロゴ | 回転リング + "ILI" | シンプルテキスト "ILIS" |
| アイコン | 複数色 + border | 単色 + borderなし |
| ホバー | glow効果 + border変化 | 背景色のみ変化 |
| アクティブ | 複雑なグラデーション | シンプルな背景 + 左バー |

### コンポーネント構造

```
Sidebar
├── sidebar-brand
│   ├── brand-logo ("ILIS")
│   └── brand-name ("SYSTEM")
├── sidebar-toggle
├── sidebar-nav
│   └── nav-item (×3)
│       ├── nav-icon
│       ├── nav-label
│       └── active-bar
└── sidebar-footer
    ├── nav-item (Settings)
    └── status
        ├── status-dot
        └── status-text
```

### スタイル仕様

```scss
// ホバー効果 - VSCode風
&:hover {
  background: rgba($text-primary, 0.08);
  color: $text-primary;
}

// アクティブ状態
&.active {
  background: rgba($primary-color, 0.1);
  color: $primary-color;
}
```

## 2. ウィンドウコントロール設計

### スタイル仕様

```scss
.window-control-button {
  width: 46px;
  height: 36px;
  background: transparent;
  border: none;  // borderを完全に削除

  &:hover {
    background: rgba($text-primary, 0.1);
  }

  &.close:hover {
    background: #e81123;  // Windows標準の赤
    color: white;
  }
}
```

## 3. 背景パターン設計

### パターン配置（非重複）

```
パターン1 (外側): 半径 750-850px
  └── キャンバス: 1800x1800px
  └── 表示サイズ: 1600x1600px

パターン2 (中間): 半径 450-550px
  └── キャンバス: 1200x1200px
  └── 表示サイズ: 1000x1000px

パターン3 (内側): 半径 200-350px
  └── キャンバス: 800x800px
  └── 表示サイズ: 600x600px
```

### カラー仕様

| 名前 | HEX | 用途 |
|------|-----|------|
| LIGHT_BLUE | #4dc9ff | メインカラー |
| LIGHT_BLUE_MEDIUM | rgba(77, 201, 255, 0.6) | 中間要素 |
| LIGHT_BLUE_LIGHT | rgba(77, 201, 255, 0.35) | 薄い要素 |

### アニメーション

| パターン | 回転方向 | 時間 | 透明度 |
|----------|----------|------|--------|
| 1 (外側) | 正転 | 100s | 0.18 |
| 2 (中間) | 逆転 | 70s | 0.22 |
| 3 (内側) | 正転 | 50s | 0.25 |

## 4. ファイル構成

### 変更ファイル

```
src/renderer/main/components/
├── Sidebar/
│   ├── Sidebar.tsx      (簡素化)
│   └── Sidebar.scss     (スタイル変更)
├── WindowControls/
│   ├── WindowControls.tsx (タイトル変更)
│   └── WindowControls.scss (VSCode風に変更)
└── Background/
    ├── CyberBackground.tsx (PNG参照に変更)
    └── CyberBackground.scss (サイズ調整)
```

### 新規ファイル

```
public/images/cyber-patterns/
├── pattern-1-v2.png  (外側ドーナツ)
├── pattern-2-v2.png  (中間ドーナツ)
└── pattern-3-v2.png  (内側ドーナツ)

scripts/
└── generate-patterns-v2.js  (PNG生成スクリプト)
```

## 5. パフォーマンス改善

### 削除した重い処理

- `filter: drop-shadow()` - GPU負荷が高い
- 複数の疑似要素によるグラデーションオーバーレイ
- `animation: pulse-glow` - 継続的なフィルター処理

### 残した軽量処理

- `animation: rotate` - GPU最適化済み
- `opacity` - 軽量
- シンプルな `background: rgba()`
