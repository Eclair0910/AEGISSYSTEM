import React from 'react';
import { SystemInfo } from '../../../../types/system';
import PerformanceChart from '../../components/PerformanceChart/PerformanceChart';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import LanIcon from '@mui/icons-material/Lan';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import './Network.scss';

interface NetworkProps {
  systemInfo: SystemInfo | null;
  isLoading: boolean;
  error: string | null;
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatSpeed = (bytesPerSec: number): string => {
  if (bytesPerSec === 0) return '0 B/s';
  const k = 1024;
  const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
  const i = Math.floor(Math.log(bytesPerSec) / Math.log(k));
  return parseFloat((bytesPerSec / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const Network: React.FC<NetworkProps> = ({ systemInfo, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="network-page loading">
        <div className="spinner" />
        <p>Loading network information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="network-page error">
        <p>{error}</p>
      </div>
    );
  }

  if (!systemInfo || !systemInfo.network) return null;

  const net = systemInfo.network;
  const linkSpeedBytes = (net.speed || 1000) * 125000; // Mbps → bytes/sec
  const uploadPercent = Math.min(((net.txSec ?? 0) / linkSpeedBytes) * 100, 100);
  const downloadPercent = Math.min(((net.rxSec ?? 0) / linkSpeedBytes) * 100, 100);

  return (
    <div className="network-page">
      <div className="page-header">
        <h1 className="page-title">Network Monitor</h1>
      </div>

      {/* Speed Display */}
      <div className="speed-section">
        <div className="speed-card upload">
          <div className="speed-card-header">
            <UploadIcon />
            <span>Upload</span>
          </div>
          <div className="speed-card-value">{formatSpeed(net.txSec ?? 0)}</div>
          <div className="speed-card-bar">
            <div className="bar-fill" style={{ width: `${uploadPercent}%` }} />
          </div>
          <div className="speed-card-percent">{uploadPercent.toFixed(1)}% of link speed</div>
        </div>
        <div className="speed-card download">
          <div className="speed-card-header">
            <DownloadIcon />
            <span>Download</span>
          </div>
          <div className="speed-card-value">{formatSpeed(net.rxSec ?? 0)}</div>
          <div className="speed-card-bar">
            <div className="bar-fill" style={{ width: `${downloadPercent}%` }} />
          </div>
          <div className="speed-card-percent">{downloadPercent.toFixed(1)}% of link speed</div>
        </div>
      </div>

      {/* Real-time Charts */}
      <div className="charts-section">
        <h2 className="section-title">Real-time Traffic</h2>
        <div className="charts-grid">
          <PerformanceChart
            title="Upload"
            currentValue={uploadPercent}
            color="#ff006e"
          />
          <PerformanceChart
            title="Download"
            currentValue={downloadPercent}
            color="#00d9ff"
          />
        </div>
      </div>

      {/* Interface Info */}
      <div className="interface-section">
        <h2 className="section-title">
          <LanIcon /> Interface Details
        </h2>
        <div className="interface-card">
          <div className="interface-grid">
            <div className="info-item">
              <span className="info-label">Interface</span>
              <span className="info-value">{net.interface}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status</span>
              <span className={`info-value status ${net.operstate === 'up' ? 'up' : 'down'}`}>
                <SignalCellularAltIcon />
                {net.operstate?.toUpperCase() ?? 'UNKNOWN'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">IPv4</span>
              <span className="info-value mono">{net.ip4 ?? 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">IPv6</span>
              <span className="info-value mono">{net.ip6 ?? 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">MAC Address</span>
              <span className="info-value mono">{net.mac ?? 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Link Speed</span>
              <span className="info-value">{net.speed ? `${net.speed} Mbps` : 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Connection Type</span>
              <span className="info-value">{net.type ?? 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-section">
        <h2 className="section-title">
          <NetworkCheckIcon /> Session Statistics
        </h2>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Total Sent</span>
            <span className="stat-value upload">{formatBytes(net.totalSent ?? net.sent)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total Received</span>
            <span className="stat-value download">{formatBytes(net.totalReceived ?? net.received)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Current Upload</span>
            <span className="stat-value">{formatSpeed(net.txSec ?? 0)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Current Download</span>
            <span className="stat-value">{formatSpeed(net.rxSec ?? 0)}</span>
          </div>
        </div>
      </div>

      <div className="timestamp">
        Last Updated: {new Date(systemInfo.timestamp).toLocaleTimeString('en-US')}
      </div>
    </div>
  );
};

export default Network;
