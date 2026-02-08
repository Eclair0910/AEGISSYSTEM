export interface MemoryInfo {
  total: number;
  used: number;
  free: number;
  usedPercentage: number;
  available: number;
  swapTotal: number;
  swapUsed: number;
  swapFree: number;
}

export interface ProcessMemoryInfo {
  pid: number;
  name: string;
  mem: number;
  memPercentage: number;
}

export interface CPUInfo {
  currentLoad: number;
  cores: number;
  temperature?: number;
  speed?: number;
  model?: string;
  threads: number;
}

export interface CPUCoreInfo {
  core: number;
  load: number;
}

export interface GPUInfo {
  model: string;
  vendor: string;
  memoryTotal: number;
  memoryUsed: number;
  memoryFree: number;
  utilizationGpu: number;
  utilizationMemory: number;
  temperatureGpu?: number;
}

export interface DiskInfo {
  size: number;
  used: number;
  available: number;
  usedPercentage: number;
  fs: string;
  mount: string;
}

export interface NetworkInfo {
  interface: string;
  sent: number;
  received: number;
  speed?: number;
}

export interface SystemInfo {
  memory: MemoryInfo;
  cpu: CPUInfo;
  cpuCores?: CPUCoreInfo[];
  gpu?: GPUInfo[];
  disk?: DiskInfo;
  network?: NetworkInfo;
  topProcesses?: ProcessMemoryInfo[];
  timestamp: number;
}

export interface HistoricalData {
  timestamp: number;
  cpuLoad: number;
  memoryUsed: number;
  gpuLoad?: number;
}

export interface LoadingProgress {
  percentage: number;
  message?: string;
}
