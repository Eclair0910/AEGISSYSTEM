# 開発ガイドライン

## 1. コーディング規約

### 1.1 TypeScript

#### 厳格モードの使用

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

#### 型定義

```typescript
// Good: 明示的な型定義
interface SystemInfo {
  cpu: CpuInfo;
  memory: MemoryInfo;
}

const getSystemInfo = async (): Promise<SystemInfo> => {
  // ...
};

// Bad: any型の使用
const getSystemInfo = async (): Promise<any> => {
  // ...
};
```

#### 列挙型

```typescript
// 文字列列挙型を推奨
enum IpcChannel {
  WindowMinimize = 'window:minimize',
  WindowMaximize = 'window:maximize',
  WindowClose = 'window:close',
  SystemGetInfo = 'system:getInfo'
}
```

### 1.2 React

#### 関数コンポーネントの使用

```tsx
// Good: 関数コンポーネント + アロー関数
interface TitleBarProps {
  title: string;
}

export const TitleBar: React.FC<TitleBarProps> = ({ title }) => {
  return (
    <header className="title-bar">
      <h1>{title}</h1>
      <WindowControls />
    </header>
  );
};

// Bad: クラスコンポーネント（レガシー）
class TitleBar extends React.Component {
  // ...
}
```

#### フックの使用

```tsx
// カスタムフック
export const useSystemInfo = (interval: number = 1000) => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      const info = await window.api.system.getInfo();
      setSystemInfo(info);
    };

    fetchInfo();
    const timer = setInterval(fetchInfo, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return systemInfo;
};
```

#### Props の分割代入

```tsx
// Good
const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

// Bad
const Button: React.FC<ButtonProps> = (props) => {
  return (
    <button onClick={props.onClick} disabled={props.disabled}>
      {props.label}
    </button>
  );
};
```

### 1.3 インポート順序

```typescript
// 1. 外部ライブラリ
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. 内部モジュール（絶対パス）
import { useSystemInfo } from '@/hooks';
import { formatBytes } from '@/utils';

// 3. コンポーネント
import { GearBackground } from '@/components/common';
import { TitleBar } from '@/components/layout';

// 4. 型定義
import type { SystemInfo } from '@/types';

// 5. スタイル
import './PerformancePage.scss';
```

## 2. 命名規則

### 2.1 変数・関数

| 種類 | 規則 | 例 |
|------|------|-----|
| 変数 | camelCase | `systemInfo`, `cpuUsage` |
| 関数 | camelCase | `getSystemInfo`, `formatBytes` |
| 定数 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`, `DEFAULT_INTERVAL` |
| 真偽値 | is/has/can接頭辞 | `isLoading`, `hasError`, `canSubmit` |
| イベントハンドラ | handle接頭辞 | `handleClick`, `handleSubmit` |

### 2.2 コンポーネント

| 種類 | 規則 | 例 |
|------|------|-----|
| コンポーネント | PascalCase | `TitleBar`, `WindowControls` |
| ページ | PascalCase + Page接尾辞 | `MainPage`, `PerformancePage` |
| フック | use接頭辞 + camelCase | `useSystemInfo`, `useWindowControls` |

### 2.3 CSS クラス

```scss
// BEM記法を使用
.title-bar {
  // Block
  &__title {
    // Element
  }
  &__controls {
    // Element
  }
  &--maximized {
    // Modifier
  }
}

// ユーティリティクラス
.u-text-center { text-align: center; }
.u-mt-1 { margin-top: 0.5rem; }
```

### 2.4 ファイル・ディレクトリ

| 種類 | 規則 | 例 |
|------|------|-----|
| コンポーネントファイル | PascalCase | `TitleBar.tsx` |
| コンポーネントディレクトリ | PascalCase | `TitleBar/` |
| ユーティリティ | camelCase | `formatters.ts` |
| SCSSパーシャル | _接頭辞 | `_variables.scss` |

## 3. スタイリング規約

### 3.1 SCSS変数

```scss
// src/renderer/styles/_variables.scss

// Colors
$color-primary: #00D9FF;
$color-secondary: #FF00AA;
$color-background: #0A0A0F;
$color-surface: #1A1A2E;
$color-text-primary: #FFFFFF;
$color-text-secondary: #8888AA;

// Spacing
$spacing-xs: 0.25rem;
$spacing-sm: 0.5rem;
$spacing-md: 1rem;
$spacing-lg: 1.5rem;
$spacing-xl: 2rem;

// Typography
$font-size-xs: 0.75rem;
$font-size-sm: 0.875rem;
$font-size-md: 1rem;
$font-size-lg: 1.25rem;
$font-size-xl: 1.5rem;

// Border Radius
$border-radius-sm: 4px;
$border-radius-md: 8px;
$border-radius-lg: 16px;
$border-radius-full: 50%;

// Animation
$transition-fast: 0.15s ease;
$transition-normal: 0.3s ease;
$transition-slow: 0.5s ease;
```

### 3.2 SCSSミックスイン

```scss
// src/renderer/styles/_mixins.scss

// Flexbox
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

// Glow Effect
@mixin glow($color, $intensity: 10px) {
  box-shadow: 0 0 $intensity $color;
}

// Responsive
@mixin responsive($breakpoint) {
  @if $breakpoint == 'sm' {
    @media (max-width: 576px) { @content; }
  } @else if $breakpoint == 'md' {
    @media (max-width: 768px) { @content; }
  } @else if $breakpoint == 'lg' {
    @media (max-width: 992px) { @content; }
  }
}

// ページヘッダー（タイトル + 区切り線）
@mixin page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-lg;
  padding-bottom: $spacing-md;
  border-bottom: 1px solid rgba($primary-color, 0.3);

  .page-title {
    font-size: $font-size-xxl;
    color: $primary-color;
    @include text-glow($primary-color, 0.8);
    font-weight: 600;
    margin: 0;
  }
}
```

### 3.3 ページヘッダーのルール

各ページの1行目にはページタイトルを配置し、区切り線を表示する。

#### 構造

```tsx
<div className="[page-name]-page">
  <div className="page-header">
    <h1 className="page-title">Page Title</h1>
    {/* オプション: アクションボタン */}
  </div>
  {/* ページコンテンツ */}
</div>
```

#### スタイル

```scss
.page-header {
  @include page-header;

  // オプション: リフレッシュボタンなどのアクション
  .refresh-button {
    // ボタンスタイル
  }
}
```

#### ルール

1. **必須**: すべてのページに `page-header` クラスを持つヘッダーを配置する
2. **必須**: ヘッダー内に `page-title` クラスを持つ `h1` 要素を配置する
3. **必須**: `@include page-header` ミックスインを使用して一貫したスタイルを適用する
4. **任意**: リフレッシュボタンなどのアクションボタンを右側に配置可能
5. **必須**: ページコンテンツの幅は `max-width: 1400px` で統一する

#### ページ共通スタイル

```scss
.[page-name]-page {
  @include flex-column($spacing-lg);
  padding: $spacing-xl;
  max-width: 1400px;  // 統一されたコンテンツ幅
  margin: 0 auto;
  width: 100%;

  .page-header {
    @include page-header;
  }
}
```

### 3.4 コンポーネントスタイル

```scss
// src/renderer/components/common/WindowControls/WindowControls.scss
@use '../../styles/variables' as *;
@use '../../styles/mixins' as *;

.window-controls {
  @include flex-center;
  gap: $spacing-xs;
  -webkit-app-region: no-drag;

  &__button {
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    color: $color-text-secondary;
    cursor: pointer;
    transition: all $transition-fast;
    border-radius: $border-radius-sm;

    &:hover {
      background: rgba($color-primary, 0.2);
      color: $color-text-primary;
    }

    &--close:hover {
      background: rgba(#ff4444, 0.8);
      color: white;
    }
  }
}
```

## 4. テスト規約

### 4.1 テストファイル配置

```
ComponentName/
├── ComponentName.tsx
├── ComponentName.scss
└── ComponentName.test.tsx    # コンポーネントと同階層
```

### 4.2 テスト命名

```typescript
describe('ComponentName', () => {
  describe('when condition', () => {
    it('should expected behavior', () => {
      // ...
    });
  });
});
```

### 4.3 テスト例

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { WindowControls } from './WindowControls';

describe('WindowControls', () => {
  describe('when clicking minimize button', () => {
    it('should call window.api.window.minimize', () => {
      const mockMinimize = jest.fn();
      window.api = { window: { minimize: mockMinimize } };

      render(<WindowControls />);
      fireEvent.click(screen.getByRole('button', { name: /minimize/i }));

      expect(mockMinimize).toHaveBeenCalledTimes(1);
    });
  });
});
```

## 5. Git規約

### 5.1 ブランチ命名

| 種類 | パターン | 例 |
|------|---------|-----|
| 機能追加 | `feature/[説明]` | `feature/add-performance-page` |
| バグ修正 | `fix/[説明]` | `fix/memory-leak` |
| リファクタ | `refactor/[説明]` | `refactor/window-controls` |
| ドキュメント | `docs/[説明]` | `docs/update-readme` |

### 5.2 コミットメッセージ

```
[type]: [subject]

[body]

[footer]
```

#### タイプ

| タイプ | 説明 |
|--------|------|
| feat | 新機能 |
| fix | バグ修正 |
| docs | ドキュメント |
| style | コードスタイル（動作に影響なし） |
| refactor | リファクタリング |
| test | テスト |
| chore | ビルド・補助ツール |

#### 例

```
feat: add circular progress component

- Implement CircularProgress component with SCSS
- Add animation for smooth progress transition
- Support customizable size and stroke width

Closes #123
```

### 5.3 プルリクエスト

```markdown
## 概要
<!-- 変更の概要を簡潔に -->

## 変更内容
- [ ] 変更点1
- [ ] 変更点2

## テスト確認
- [ ] `npm run type-check` パス
- [ ] `npm run lint` パス
- [ ] 手動テスト完了

## スクリーンショット
<!-- UIの変更がある場合 -->
```

## 6. コードレビューチェックリスト

### レビュアー向け

- [ ] TypeScriptの型が適切に定義されているか
- [ ] コンポーネントは再利用可能か
- [ ] SCSSが変数・ミックスインを活用しているか
- [ ] 命名規則に従っているか
- [ ] セキュリティ上の問題がないか
- [ ] パフォーマンスに影響する処理がないか
- [ ] エラーハンドリングが適切か
