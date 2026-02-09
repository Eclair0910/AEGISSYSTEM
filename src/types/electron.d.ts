import { SystemInfo } from './system';

export interface WindowControls {
  minimize: () => Promise<void>;
  maximize: () => Promise<void>;
  close: () => Promise<void>;
  isMaximized: () => Promise<boolean>;
}

export interface SystemAPI {
  getInfo: () => Promise<SystemInfo>;
  onUpdate: (callback: (info: SystemInfo) => void) => void;
  removeListener: (callback: (info: SystemInfo) => void) => void;
}

export interface DetailedSystemInfo {
  os: {
    platform: string;
    distro: string;
    release: string;
    arch: string;
    hostname: string;
  };
  cpu: {
    manufacturer: string;
    brand: string;
    speed: number;
    cores: number;
    physicalCores: number;
    processors: number;
  };
  memoryLayout: Array<{
    size: number;
    type: string;
    clockSpeed: number | null;
    manufacturer: string;
  }>;
  diskLayout: Array<{
    device: string;
    type: string;
    name: string;
    size: number;
    vendor: string;
  }>;
  baseboard: {
    manufacturer: string;
    model: string;
    version: string;
  };
  bios: {
    vendor: string;
    version: string;
    releaseDate: string;
  };
}

export interface EventLogEntry {
  id: number;
  level: 'Error' | 'Warning' | 'Information';
  source: string;
  eventId: number;
  message: string;
  timestamp: string;
  category: string;
}

export interface DriveInfo {
  letter: string;
  label: string;
  type: 'HDD' | 'SSD' | 'NVMe' | 'Removable' | 'Network';
  totalSize: number;
  usedSize: number;
  freeSize: number;
  fileSystem: string;
}

export interface ElectronAPI {
  windowControls: WindowControls;
  system: SystemAPI;
  getDetailedSystemInfo?: () => Promise<DetailedSystemInfo>;
  getEventLogs?: () => Promise<EventLogEntry[]>;
  getDriveInfo?: () => Promise<DriveInfo[]>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
