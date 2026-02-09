import si from 'systeminformation';
import { SystemInfo } from '../../types/system';

export class SystemInfoService {
  private updateInterval: NodeJS.Timeout | null = null;
  private listeners: Set<(info: SystemInfo) => void> = new Set();

  async getSystemInfo(): Promise<SystemInfo> {
    try {
      const [memory, cpu, disks] = await Promise.all([
        si.mem(),
        si.currentLoad(),
        si.fsSize()
      ]);

      const systemInfo: SystemInfo = {
        memory: {
          total: memory.total,
          used: memory.used,
          free: memory.free,
          usedPercentage: (memory.used / memory.total) * 100,
          available: memory.available,
          swapTotal: memory.swaptotal,
          swapUsed: memory.swapused,
          swapFree: memory.swapfree
        },
        cpu: {
          currentLoad: cpu.currentLoad,
          cores: cpu.cpus?.length || 0,
          threads: cpu.cpus?.length || 0
        },
        timestamp: Date.now()
      };

      // ディスク情報が利用可能な場合
      if (disks && disks.length > 0) {
        const primaryDisk = disks[0];
        systemInfo.disk = {
          size: primaryDisk.size,
          used: primaryDisk.used,
          available: primaryDisk.available,
          usedPercentage: (primaryDisk.used / primaryDisk.size) * 100,
          fs: primaryDisk.fs,
          mount: primaryDisk.mount
        };
      }

      // CPU温度を取得（利用可能な場合）
      try {
        const temp = await si.cpuTemperature();
        if (temp.main && temp.main > 0) {
          systemInfo.cpu.temperature = temp.main;
        }
      } catch (error) {
        // 温度が取得できない環境では無視
      }

      return systemInfo;
    } catch (error) {
      console.error('Failed to get system info:', error);
      // フォールバック値を返す
      return {
        memory: {
          total: 0,
          used: 0,
          free: 0,
          usedPercentage: 0,
          available: 0,
          swapTotal: 0,
          swapUsed: 0,
          swapFree: 0
        },
        cpu: {
          currentLoad: 0,
          cores: 0,
          threads: 0
        },
        timestamp: Date.now()
      };
    }
  }

  startMonitoring(callback: (info: SystemInfo) => void, interval: number = 1000) {
    this.listeners.add(callback);

    if (!this.updateInterval) {
      this.updateInterval = setInterval(async () => {
        const info = await this.getSystemInfo();
        this.listeners.forEach(listener => listener(info));
      }, interval);
    }
  }

  stopMonitoring(callback?: (info: SystemInfo) => void) {
    if (callback) {
      this.listeners.delete(callback);
    } else {
      this.listeners.clear();
    }

    if (this.listeners.size === 0 && this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  destroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.listeners.clear();
  }
}
