import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { SystemInfo } from '../../types/system';

// セキュアなAPIをレンダラープロセスに公開
contextBridge.exposeInMainWorld('electronAPI', {
  windowControls: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),
    isMaximized: () => ipcRenderer.invoke('window:isMaximized')
  },
  system: {
    getInfo: () => ipcRenderer.invoke('system:getInfo'),
    onUpdate: (callback: (info: SystemInfo) => void) => {
      const listener = (_event: IpcRendererEvent, info: SystemInfo) => callback(info);
      ipcRenderer.on('system:update', listener);
    },
    removeListener: (_callback: (info: SystemInfo) => void) => {
      ipcRenderer.removeAllListeners('system:update');
    }
  }
});
