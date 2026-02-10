import { useState, useEffect } from 'react';
import { SystemInfo } from '../../../types/system';

// Mock data for browser environment
const getMockSystemInfo = (): SystemInfo => {
  const baseLoad = 30 + Math.random() * 40;
  const memUsed = 8000000000 + Math.random() * 8000000000;
  const memTotal = 16000000000;

  return {
    cpu: {
      model: 'Mock CPU (Browser Mode)',
      cores: 8,
      threads: 16,
      speed: 3.2 + Math.random() * 0.8,
      currentLoad: baseLoad,
      temperature: 45 + Math.random() * 15
    },
    memory: {
      total: memTotal,
      free: memTotal - memUsed,
      used: memUsed,
      usedPercentage: (memUsed / memTotal) * 100
    },
    cpuCores: Array.from({ length: 8 }, (_, i) => ({
      core: i,
      load: 20 + Math.random() * 60
    })),
    gpu: [{
      vendor: 'Mock Vendor',
      model: 'Mock GPU (Browser Mode)',
      memoryTotal: 8000000000,
      memoryUsed: 4000000000 + Math.random() * 2000000000,
      utilizationGpu: 30 + Math.random() * 40,
      utilizationMemory: 40 + Math.random() * 30,
      temperatureGpu: 50 + Math.random() * 20
    }],
    disk: {
      size: 1024 * 1024 * 1024 * 1024,
      used: 512 * 1024 * 1024 * 1024,
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
    topProcesses: [
      { pid: 1001, name: 'Chrome', mem: 2000000000, memPercentage: 12.5 },
      { pid: 1002, name: 'VSCode', mem: 1500000000, memPercentage: 9.4 },
      { pid: 1003, name: 'Node', mem: 800000000, memPercentage: 5.0 },
      { pid: 1004, name: 'Docker', mem: 600000000, memPercentage: 3.8 },
      { pid: 1005, name: 'Terminal', mem: 400000000, memPercentage: 2.5 }
    ],
    timestamp: Date.now()
  };
};

export const useSystemInfo = (interval: number = 1000) => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const fetchSystemInfo = async () => {
      try {
        // Check if running in Electron environment
        if (window.electronAPI?.system?.getInfo) {
          const info = await window.electronAPI.system.getInfo();
          if (isActive) {
            setSystemInfo(info);
            setIsLoading(false);
            setError(null);
          }
        } else {
          // Browser environment - use mock data
          if (isActive) {
            setSystemInfo(getMockSystemInfo());
            setIsLoading(false);
            setError(null);
          }
        }
      } catch (err) {
        if (isActive) {
          // Fallback to mock data on error
          setSystemInfo(getMockSystemInfo());
          setIsLoading(false);
          setError(null);
        }
      }
    };

    // Initial fetch
    fetchSystemInfo();

    // Periodic updates
    const timer = setInterval(fetchSystemInfo, interval);

    return () => {
      isActive = false;
      clearInterval(timer);
    };
  }, [interval]);

  return { systemInfo, isLoading, error };
};
