import { app, BrowserWindow } from 'electron';
import { createSplashWindow } from './windows/splashWindow';
import { createMainWindow } from './windows/mainWindow';
import { setupIpcHandlers, destroyIpcHandlers } from './ipc/handlers';

let splashWindow: BrowserWindow | null = null;
let mainWindow: BrowserWindow | null = null;

// スプラッシュ画面の最小表示時間（ミリ秒）
const MIN_SPLASH_TIME = 2500;

async function createWindows() {
  // IPCハンドラーをセットアップ
  setupIpcHandlers();

  // スプラッシュウィンドウを作成
  splashWindow = createSplashWindow();

  const splashStartTime = Date.now();

  // メインウィンドウを作成（バックグラウンドで）
  mainWindow = createMainWindow();

  // メインウィンドウの読み込み完了を待つ
  await new Promise<void>((resolve) => {
    mainWindow!.webContents.once('did-finish-load', () => {
      resolve();
    });
  });

  // スプラッシュ画面の最小表示時間を確保
  const elapsedTime = Date.now() - splashStartTime;
  const remainingTime = Math.max(0, MIN_SPLASH_TIME - elapsedTime);

  setTimeout(() => {
    // メインウィンドウを表示
    mainWindow?.show();

    // スプラッシュウィンドウを閉じる
    if (splashWindow && !splashWindow.isDestroyed()) {
      splashWindow.close();
      splashWindow = null;
    }
  }, remainingTime);

  // ウィンドウが閉じられたときの処理
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// アプリケーションの準備完了
app.whenReady().then(() => {
  createWindows();

  // macOSでは、アプリがアクティブになったときにウィンドウを再作成
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindows();
    }
  });
});

// すべてのウィンドウが閉じられたとき
app.on('window-all-closed', () => {
  // macOS以外では、アプリケーションを終了
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// アプリケーション終了前のクリーンアップ
app.on('before-quit', () => {
  destroyIpcHandlers();
});

// 開発環境での設定
if (process.env.NODE_ENV === 'development') {
  // 必要に応じて開発用の設定を追加
}
