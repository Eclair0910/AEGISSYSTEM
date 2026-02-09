import { BrowserWindow } from 'electron';
import path from 'path';

export function createMainWindow(): BrowserWindow {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    show: false, // 初期は非表示にして、準備完了後に表示
    backgroundColor: '#050816',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload/preload.js')
    }
  });

  // 開発環境とプロダクション環境で異なるURLを読み込む
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(`${process.env.VITE_DEV_SERVER_URL}/main/index.html`);

    // 開発環境ではDevToolsを開く
    if (process.env.NODE_ENV === 'development') {
      mainWindow.webContents.openDevTools();
    }
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/main/index.html'));
  }

  // ウィンドウの準備が完了したら表示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // セキュリティ: 外部URLへのナビゲーションをブロック
  mainWindow.webContents.on('will-navigate', (event, url) => {
    const isDevServer = process.env.VITE_DEV_SERVER_URL && url.startsWith(process.env.VITE_DEV_SERVER_URL);
    const isLocalFile = url.startsWith('file://');

    if (!isDevServer && !isLocalFile) {
      event.preventDefault();
      console.warn('[Security] Blocked navigation to external URL:', url);
    }
  });

  // セキュリティ: 新しいウィンドウ（外部リンク）をブロック
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    console.warn('[Security] Blocked attempt to open external window:', url);
    return { action: 'deny' };
  });

  return mainWindow;
}
