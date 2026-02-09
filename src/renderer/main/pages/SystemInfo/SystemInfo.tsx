import React, { useEffect, useState } from 'react';
import ComputerIcon from '@mui/icons-material/Computer';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import InfoIcon from '@mui/icons-material/Info';
import SpeedIcon from '@mui/icons-material/Speed';
import RefreshIcon from '@mui/icons-material/Refresh';
import './SystemInfo.scss';

interface OSInfo {
  platform: string;
  distro: string;
  release: string;
  arch: string;
  hostname: string;
}

interface CPUDetailInfo {
  manufacturer: string;
  brand: string;
  speed: number;
  cores: number;
  physicalCores: number;
  processors: number;
}

interface MemoryLayoutInfo {
  size: number;
  type: string;
  clockSpeed: number | null;
  manufacturer: string;
}

interface DiskLayoutInfo {
  device: string;
  type: string;
  name: string;
  size: number;
  vendor: string;
}

interface BaseboardInfo {
  manufacturer: string;
  model: string;
  version: string;
}

interface BiosInfo {
  vendor: string;
  version: string;
  releaseDate: string;
}

interface DetailedSystemInfo {
  os: OSInfo;
  cpu: CPUDetailInfo;
  memoryLayout: MemoryLayoutInfo[];
  diskLayout: DiskLayoutInfo[];
  baseboard: BaseboardInfo;
  bios: BiosInfo;
}

const SystemInfo: React.FC = () => {
  const [systemInfo, setSystemInfo] = useState<DetailedSystemInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'hardware' | 'storage'>('overview');

  const fetchSystemInfo = async () => {
    setIsLoading(true);
    try {
      if (window.electronAPI?.getDetailedSystemInfo) {
        const info = await window.electronAPI.getDetailedSystemInfo();
        setSystemInfo(info);
      } else {
        // Mock data for browser development
        setSystemInfo({
          os: {
            platform: 'win32',
            distro: 'Microsoft Windows 11 Pro',
            release: '10.0.22631',
            arch: 'x64',
            hostname: 'DESKTOP-AEGIS',
          },
          cpu: {
            manufacturer: 'Intel',
            brand: 'Core i7-12700K',
            speed: 3.6,
            cores: 20,
            physicalCores: 12,
            processors: 1,
          },
          memoryLayout: [
            { size: 17179869184, type: 'DDR5', clockSpeed: 4800, manufacturer: 'Samsung' },
            { size: 17179869184, type: 'DDR5', clockSpeed: 4800, manufacturer: 'Samsung' },
          ],
          diskLayout: [
            { device: '\\\\.\\PHYSICALDRIVE0', type: 'NVMe', name: 'Samsung SSD 980 PRO', size: 1000204886016, vendor: 'Samsung' },
            { device: '\\\\.\\PHYSICALDRIVE1', type: 'SSD', name: 'WD Blue SN570', size: 500107862016, vendor: 'Western Digital' },
          ],
          baseboard: {
            manufacturer: 'ASUS',
            model: 'ROG STRIX Z690-A GAMING WIFI D4',
            version: 'Rev 1.xx',
          },
          bios: {
            vendor: 'American Megatrends Inc.',
            version: '2103',
            releaseDate: '2023-06-15',
          },
        });
      }
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch system information');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemInfo();
  }, []);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTotalMemory = (): number => {
    if (!systemInfo) return 0;
    return systemInfo.memoryLayout.reduce((sum, mem) => sum + mem.size, 0);
  };

  const getTotalStorage = (): number => {
    if (!systemInfo) return 0;
    return systemInfo.diskLayout.reduce((sum, disk) => sum + disk.size, 0);
  };

  if (isLoading) {
    return (
      <div className="system-info-page loading">
        <div className="spinner" />
        <p>Loading system information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="system-info-page error">
        <p>{error}</p>
      </div>
    );
  }

  if (!systemInfo) {
    return null;
  }

  return (
    <div className="system-info-page">
      <div className="page-header">
        <h1 className="page-title">System Information</h1>
        <button className="refresh-button" onClick={fetchSystemInfo}>
          <RefreshIcon />
          <span>Refresh</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon-wrapper">
            <ComputerIcon className="card-icon" />
          </div>
          <div className="card-content">
            <span className="card-label">Operating System</span>
            <span className="card-value">{systemInfo.os.distro.split(' ').slice(-2).join(' ')}</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon-wrapper">
            <MemoryIcon className="card-icon" />
          </div>
          <div className="card-content">
            <span className="card-label">Processor</span>
            <span className="card-value">{systemInfo.cpu.brand}</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon-wrapper">
            <DeveloperBoardIcon className="card-icon" />
          </div>
          <div className="card-content">
            <span className="card-label">Memory</span>
            <span className="card-value">{formatBytes(getTotalMemory())}</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon-wrapper">
            <StorageIcon className="card-icon" />
          </div>
          <div className="card-content">
            <span className="card-label">Storage</span>
            <span className="card-value">{formatBytes(getTotalStorage())}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <ComputerIcon />
          <span>Overview</span>
        </button>
        <button
          className={`tab ${activeTab === 'hardware' ? 'active' : ''}`}
          onClick={() => setActiveTab('hardware')}
        >
          <MemoryIcon />
          <span>Hardware</span>
        </button>
        <button
          className={`tab ${activeTab === 'storage' ? 'active' : ''}`}
          onClick={() => setActiveTab('storage')}
        >
          <StorageIcon />
          <span>Storage</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            {/* OS Information */}
            <section className="info-section">
              <div className="section-header">
                <ComputerIcon className="section-icon" />
                <h2>Operating System</h2>
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">OS</span>
                  <span className="value">{systemInfo.os.distro}</span>
                </div>
                <div className="info-item">
                  <span className="label">Version</span>
                  <span className="value">{systemInfo.os.release}</span>
                </div>
                <div className="info-item">
                  <span className="label">Architecture</span>
                  <span className="value">{systemInfo.os.arch}</span>
                </div>
                <div className="info-item">
                  <span className="label">Hostname</span>
                  <span className="value">{systemInfo.os.hostname}</span>
                </div>
              </div>
            </section>

            {/* Motherboard & BIOS Information */}
            <section className="info-section">
              <div className="section-header">
                <InfoIcon className="section-icon" />
                <h2>Motherboard & BIOS</h2>
              </div>
              <div className="info-grid">
                <div className="info-item full-width">
                  <span className="label">Motherboard</span>
                  <span className="value">{systemInfo.baseboard.manufacturer} {systemInfo.baseboard.model}</span>
                </div>
                <div className="info-item">
                  <span className="label">Version</span>
                  <span className="value">{systemInfo.baseboard.version}</span>
                </div>
                <div className="info-item">
                  <span className="label">BIOS Vendor</span>
                  <span className="value">{systemInfo.bios.vendor}</span>
                </div>
                <div className="info-item">
                  <span className="label">BIOS Version</span>
                  <span className="value">{systemInfo.bios.version}</span>
                </div>
                <div className="info-item">
                  <span className="label">BIOS Date</span>
                  <span className="value">{systemInfo.bios.releaseDate}</span>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'hardware' && (
          <div className="hardware-tab">
            {/* CPU Information */}
            <section className="info-section">
              <div className="section-header">
                <MemoryIcon className="section-icon" />
                <h2>Processor</h2>
              </div>
              <div className="cpu-overview">
                <div className="cpu-main">
                  <SpeedIcon className="cpu-icon" />
                  <div className="cpu-details">
                    <span className="cpu-name">{systemInfo.cpu.manufacturer} {systemInfo.cpu.brand}</span>
                    <span className="cpu-specs">{systemInfo.cpu.physicalCores} Cores / {systemInfo.cpu.cores} Threads @ {systemInfo.cpu.speed} GHz</span>
                  </div>
                </div>
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Manufacturer</span>
                  <span className="value">{systemInfo.cpu.manufacturer}</span>
                </div>
                <div className="info-item">
                  <span className="label">Model</span>
                  <span className="value">{systemInfo.cpu.brand}</span>
                </div>
                <div className="info-item">
                  <span className="label">Base Speed</span>
                  <span className="value">{systemInfo.cpu.speed} GHz</span>
                </div>
                <div className="info-item">
                  <span className="label">Physical Cores</span>
                  <span className="value">{systemInfo.cpu.physicalCores}</span>
                </div>
                <div className="info-item">
                  <span className="label">Logical Cores</span>
                  <span className="value">{systemInfo.cpu.cores}</span>
                </div>
                <div className="info-item">
                  <span className="label">Processors</span>
                  <span className="value">{systemInfo.cpu.processors}</span>
                </div>
              </div>
            </section>

            {/* Memory Information */}
            <section className="info-section">
              <div className="section-header">
                <DeveloperBoardIcon className="section-icon" />
                <h2>Memory ({formatBytes(getTotalMemory())} Total)</h2>
              </div>
              <div className="memory-modules">
                {systemInfo.memoryLayout.map((mem, index) => (
                  <div key={index} className="memory-module">
                    <div className="module-header">
                      <span className="slot-name">Slot {index + 1}</span>
                      <span className="module-size">{formatBytes(mem.size)}</span>
                    </div>
                    <div className="module-specs">
                      <span className="spec-item">
                        <span className="spec-label">Type</span>
                        <span className="spec-value">{mem.type}</span>
                      </span>
                      <span className="spec-item">
                        <span className="spec-label">Speed</span>
                        <span className="spec-value">{mem.clockSpeed ? `${mem.clockSpeed} MHz` : 'N/A'}</span>
                      </span>
                      <span className="spec-item">
                        <span className="spec-label">Manufacturer</span>
                        <span className="spec-value">{mem.manufacturer || 'Unknown'}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'storage' && (
          <div className="storage-tab">
            {/* Storage Information */}
            <section className="info-section">
              <div className="section-header">
                <StorageIcon className="section-icon" />
                <h2>Storage Devices</h2>
              </div>
              <div className="storage-drives">
                {systemInfo.diskLayout.map((disk, index) => (
                  <div key={index} className="storage-drive">
                    <div className="drive-header">
                      <StorageIcon className="drive-icon" />
                      <div className="drive-title">
                        <span className="drive-name">{disk.name}</span>
                        <span className="drive-type-badge">{disk.type}</span>
                      </div>
                      <span className="drive-capacity">{formatBytes(disk.size)}</span>
                    </div>
                    <div className="drive-details">
                      <div className="detail-item">
                        <span className="detail-label">Vendor</span>
                        <span className="detail-value">{disk.vendor || 'Unknown'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Device</span>
                        <span className="detail-value">{disk.device}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Interface</span>
                        <span className="detail-value">{disk.type}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemInfo;
