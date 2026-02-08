import { BrowserWindow } from 'electron';
import path from 'path';

export function createSplashWindow(): BrowserWindow {
  const splashWindow = new BrowserWindow({
    width: 400,
    height: 400,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    center: true,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // 開発環境とプロダクション環境で異なるURLを読み込む
  if (process.env.VITE_DEV_SERVER_URL) {
    splashWindow.loadURL(`${process.env.VITE_DEV_SERVER_URL}/splash/index.html`);
  } else {
    splashWindow.loadFile(path.join(__dirname, '../renderer/splash/index.html'));
  }

  // セキュリティ: 外部URLへのナビゲーションをブロック
  splashWindow.webContents.on('will-navigate', (event, url) => {
    const isDevServer = process.env.VITE_DEV_SERVER_URL && url.startsWith(process.env.VITE_DEV_SERVER_URL);
    const isLocalFile = url.startsWith('file://');

    if (!isDevServer && !isLocalFile) {
      event.preventDefault();
      console.warn('[Security] Blocked navigation to external URL:', url);
    }
  });

  // セキュリティ: 新しいウィンドウ（外部リンク）をブロック
  splashWindow.webContents.setWindowOpenHandler(({ url }) => {
    console.warn('[Security] Blocked attempt to open external window:', url);
    return { action: 'deny' };
  });

  return splashWindow;
}
