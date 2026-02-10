// ブラウザ環境用のモックElectron API
import { SystemInfo, GPUInfo, ProcessMemoryInfo, CPUCoreInfo } from '../../../types/system';

// モックシステム情報を生成
const generateMockSystemInfo = (): SystemInfo => {
  const memoryUsedPercentage = 40 + Math.random() * 30; // 40-70%
  const cpuLoad = 20 + Math.random() * 50; // 20-70%

  const totalMemory = 16 * 1024 * 1024 * 1024; // 16GB
  const usedMemory = totalMemory * (memoryUsedPercentage / 100);
  const swapTotal = 4 * 1024 * 1024 * 1024; // 4GB
  const swapUsed = swapTotal * 0.1;

  // CPUコア情報
  const cpuCores: CPUCoreInfo[] = Array.from({ length: 8 }, (_, i) => ({
    core: i,
    load: 15 + Math.random() * 60
  }));

  // GPU情報（複数のGPU）
  const gpus: GPUInfo[] = [
    {
      model: 'NVIDIA GeForce RTX 4080',
      vendor: 'NVIDIA',
      memoryTotal: 16 * 1024 * 1024 * 1024,
      memoryUsed: (16 * 1024 * 1024 * 1024) * (0.3 + Math.random() * 0.4),
      memoryFree: (16 * 1024 * 1024 * 1024) * (0.3 + Math.random() * 0.4),
      utilizationGpu: 30 + Math.random() * 50,
      utilizationMemory: 25 + Math.random() * 40,
      temperatureGpu: 55 + Math.random() * 15
    }
  ];

  // トッププロセス（メモリ使用量順）
  const processNames = [
    'Chrome', 'VSCode', 'Electron', 'Node.js', 'Firefox',
    'Slack', 'Discord', 'Docker', 'Photoshop', 'Unity'
  ];
  const topProcesses: ProcessMemoryInfo[] = processNames
    .slice(0, 5)
    .map((name, i) => ({
      pid: 1000 + i,
      name,
      mem: (2 - i * 0.3) * 1024 * 1024 * 1024,
      memPercentage: (12 - i * 2) + Math.random() * 3
    }));

  return {
    memory: {
      total: totalMemory,
      used: usedMemory,
      free: totalMemory - usedMemory,
      available: totalMemory - usedMemory,
      usedPercentage: memoryUsedPercentage,
      swapTotal,
      swapUsed,
      swapFree: swapTotal - swapUsed
    },
    cpu: {
      currentLoad: cpuLoad,
      cores: 8,
      threads: 16,
      temperature: 45 + Math.random() * 15,
      speed: 3.6,
      model: 'AMD Ryzen 7 5800X'
    },
    cpuCores,
    gpu: gpus,
    disk: {
      size: 1024 * 1024 * 1024 * 1024, // 1TB
      used: 512 * 1024 * 1024 * 1024, // 512GB
      available: 512 * 1024 * 1024 * 1024,
      usedPercentage: 50,
      fs: 'NTFS',
      mount: 'C:'
    },
    network: {
      interface: 'Ethernet',
      sent: Math.random() * 1024 * 1024 * 100,
      received: Math.random() * 1024 * 1024 * 200,
      speed: 1000,
      ip4: '192.168.1.100',
      ip6: 'fe80::1',
      mac: 'AA:BB:CC:DD:EE:FF',
      type: 'wired',
      operstate: 'up',
      txSec: Math.random() * 1024 * 1024 * 5,
      rxSec: Math.random() * 1024 * 1024 * 10,
      totalSent: 2.5 * 1024 * 1024 * 1024 + Math.random() * 1024 * 1024,
      totalReceived: 8.3 * 1024 * 1024 * 1024 + Math.random() * 1024 * 1024
    },
    topProcesses,
    timestamp: Date.now()
  };
};

export const mockElectronAPI = {
  windowControls: {
    minimize: async () => {
      console.log('[Mock] Window minimized');
    },
    maximize: async () => {
      console.log('[Mock] Window maximized');
    },
    close: async () => {
      console.log('[Mock] Window closed');
    },
    isMaximized: async () => {
      return false;
    }
  },
  system: {
    getInfo: async () => {
      return generateMockSystemInfo();
    },
    onUpdate: (callback: (info: SystemInfo) => void) => {
      console.log('[Mock] System monitoring started');
    },
    removeListener: (_callback: (info: SystemInfo) => void) => {
      console.log('[Mock] System monitoring stopped');
    }
  }
};

// ブラウザ環境の場合、window.electronAPIにモックを注入
if (typeof window !== 'undefined' && !window.electronAPI) {
  (window as any).electronAPI = mockElectronAPI;
}
