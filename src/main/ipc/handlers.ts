import { ipcMain, BrowserWindow } from 'electron';
import { SystemInfoService } from './systemInfo';

const systemInfoService = new SystemInfoService();

export function setupIpcHandlers() {
  // ウィンドウコントロールハンドラー
  ipcMain.handle('window:minimize', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    window?.minimize();
  });

  ipcMain.handle('window:maximize', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window) {
      if (window.isMaximized()) {
        window.unmaximize();
      } else {
        window.maximize();
      }
    }
  });

  ipcMain.handle('window:close', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    window?.close();
  });

  ipcMain.handle('window:isMaximized', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    return window?.isMaximized() || false;
  });

  // システム情報ハンドラー
  ipcMain.handle('system:getInfo', async () => {
    return await systemInfoService.getSystemInfo();
  });

  // モニタリング開始
  ipcMain.on('system:startMonitoring', (event) => {
    systemInfoService.startMonitoring((info) => {
      event.sender.send('system:update', info);
    });
  });

  // モニタリング停止
  ipcMain.on('system:stopMonitoring', () => {
    systemInfoService.stopMonitoring();
  });
}

export function destroyIpcHandlers() {
  systemInfoService.destroy();
  ipcMain.removeHandler('window:minimize');
  ipcMain.removeHandler('window:maximize');
  ipcMain.removeHandler('window:close');
  ipcMain.removeHandler('window:isMaximized');
  ipcMain.removeHandler('system:getInfo');
  ipcMain.removeAllListeners('system:startMonitoring');
  ipcMain.removeAllListeners('system:stopMonitoring');
}
