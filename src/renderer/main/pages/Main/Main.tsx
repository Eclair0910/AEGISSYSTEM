import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SystemInfo } from '../../../../types/system';
import SpeedIcon from '@mui/icons-material/Speed';
import MemoryIcon from '@mui/icons-material/Memory';
import ComputerIcon from '@mui/icons-material/Computer';
import StorageIcon from '@mui/icons-material/Storage';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import ArticleIcon from '@mui/icons-material/Article';
import SecurityIcon from '@mui/icons-material/Security';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import './Main.scss';

interface MainProps {
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

const getSystemHealth = (info: SystemInfo) => {
  const cpuLoad = info.cpu.currentLoad;
  const memLoad = info.memory.usedPercentage;
  const gpuLoad = info.gpu?.[0]?.utilizationGpu ?? 0;
  const maxLoad = Math.max(cpuLoad, memLoad, gpuLoad);

  if (maxLoad > 90) return { status: 'critical', label: 'CRITICAL', color: '#ff4444' };
  if (maxLoad > 70) return { status: 'warning', label: 'WARNING', color: '#ffaa00' };
  if (maxLoad > 50) return { status: 'good', label: 'GOOD', color: '#00d9ff' };
  return { status: 'excellent', label: 'EXCELLENT', color: '#00cc66' };
};

const CircularGauge: React.FC<{
  percentage: number;
  label: string;
  color: string;
  icon: React.ReactNode;
  subtitle?: string;
}> = ({ percentage, label, color, icon, subtitle }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="gauge-widget">
      <div className="gauge-header">
        <span className="gauge-icon" style={{ color }}>{icon}</span>
        <span className="gauge-label">{label}</span>
      </div>
      <div className="gauge-ring">
        <svg viewBox="0 0 100 100">
          <circle className="gauge-bg" cx="50" cy="50" r={radius} />
          <circle
            className="gauge-fill"
            cx="50" cy="50" r={radius}
            style={{
              stroke: color,
              strokeDasharray: `${circumference}`,
              strokeDashoffset: `${offset}`,
            }}
          />
        </svg>
        <div className="gauge-value" style={{ color }}>{percentage.toFixed(1)}%</div>
      </div>
      {subtitle && <div className="gauge-subtitle">{subtitle}</div>}
    </div>
  );
};

const getMockRecentEvents = () => [
  { id: 1, level: 'Error' as const, source: 'Disk', message: 'Controller error detected', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: 2, level: 'Warning' as const, source: 'Kernel-Power', message: 'Shutdown transition initiated', timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: 3, level: 'Information' as const, source: 'Service Manager', message: 'Windows Update service started', timestamp: new Date(Date.now() - 10800000).toISOString() },
  { id: 4, level: 'Warning' as const, source: 'Security-SPP', message: 'Licensing status check completed', timestamp: new Date(Date.now() - 18000000).toISOString() },
  { id: 5, level: 'Information' as const, source: 'EventLog', message: 'System uptime: 3 days', timestamp: new Date(Date.now() - 32400000).toISOString() },
];

const getRelativeTime = (timestamp: string): string => {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
};

const Main: React.FC<MainProps> = ({ systemInfo, isLoading, error }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="main-page loading">
        <div className="spinner" />
        <p>Loading system information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-page error">
        <p>{error}</p>
      </div>
    );
  }

  if (!systemInfo) return null;

  const health = getSystemHealth(systemInfo);
  const recentEvents = getMockRecentEvents();

  const navCards = [
    { path: '/performance', label: 'Performance', icon: <SpeedIcon />, desc: 'Real-time CPU, Memory, GPU monitoring' },
    { path: '/network', label: 'Network', icon: <NetworkCheckIcon />, desc: 'Network traffic and connections' },
    { path: '/disk-analyzer', label: 'Disk Analyzer', icon: <StorageIcon />, desc: 'Storage usage analysis' },
    { path: '/event-log', label: 'Event Log', icon: <ArticleIcon />, desc: 'System event viewer' },
    { path: '/system-info', label: 'System Info', icon: <ComputerIcon />, desc: 'Hardware details' },
  ];

  return (
    <div className="main-page">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <div className="header-timestamp">
          Last Updated: {new Date(systemInfo.timestamp).toLocaleTimeString('en-US')}
        </div>
      </div>

      {/* Health + Gauges */}
      <div className="gauges-section">
        <div className="health-card" data-status={health.status}>
          <SecurityIcon className="health-icon" style={{ color: health.color, fontSize: 40 }} />
          <div className="health-info">
            <span className="health-label">System Health</span>
            <span className="health-status" style={{ color: health.color }}>{health.label}</span>
          </div>
          <div className="health-pulse" style={{ backgroundColor: health.color }} />
        </div>

        <CircularGauge
          percentage={systemInfo.cpu.currentLoad}
          label="CPU"
          color="#ff006e"
          icon={<ComputerIcon />}
          subtitle={systemInfo.cpu.model || `${systemInfo.cpu.cores} Cores`}
        />
        <CircularGauge
          percentage={systemInfo.memory.usedPercentage}
          label="Memory"
          color="#00d9ff"
          icon={<MemoryIcon />}
          subtitle={`${formatBytes(systemInfo.memory.used)} / ${formatBytes(systemInfo.memory.total)}`}
        />
        {systemInfo.gpu && systemInfo.gpu.length > 0 && (
          <CircularGauge
            percentage={systemInfo.gpu[0].utilizationGpu}
            label="GPU"
            color="#7b2cbf"
            icon={<SpeedIcon />}
            subtitle={systemInfo.gpu[0].model}
          />
        )}
      </div>

      {/* Disk + Network */}
      <div className="info-section">
        <div className="disk-widget">
          <h3 className="widget-title"><StorageIcon /> Disk Usage</h3>
          {systemInfo.disk && (
            <div className="disk-info">
              <div className="disk-ring-container">
                <svg viewBox="0 0 100 100" className="disk-ring">
                  <circle className="disk-bg" cx="50" cy="50" r="40" />
                  <circle
                    className="disk-fill"
                    cx="50" cy="50" r="40"
                    style={{
                      strokeDasharray: `${2 * Math.PI * 40}`,
                      strokeDashoffset: `${(2 * Math.PI * 40) * (1 - systemInfo.disk.usedPercentage / 100)}`,
                    }}
                  />
                </svg>
                <div className="disk-percent">{systemInfo.disk.usedPercentage.toFixed(0)}%</div>
              </div>
              <div className="disk-details">
                <div className="detail-row">
                  <span className="label">Mount:</span>
                  <span className="value">{systemInfo.disk.mount}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Used:</span>
                  <span className="value">{formatBytes(systemInfo.disk.used)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Free:</span>
                  <span className="value">{formatBytes(systemInfo.disk.available)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="network-widget">
          <h3 className="widget-title"><NetworkCheckIcon /> Network</h3>
          {systemInfo.network && (
            <div className="network-info">
              <div className="speed-item upload">
                <span className="speed-label">Upload</span>
                <span className="speed-value">{formatSpeed(systemInfo.network.txSec ?? systemInfo.network.sent)}</span>
              </div>
              <div className="speed-item download">
                <span className="speed-label">Download</span>
                <span className="speed-value">{formatSpeed(systemInfo.network.rxSec ?? systemInfo.network.received)}</span>
              </div>
              <div className="network-meta">
                <span>{systemInfo.network.interface}</span>
                {systemInfo.network.speed && <span>{systemInfo.network.speed} Mbps</span>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Events */}
      <div className="events-section">
        <div className="section-header">
          <h3 className="widget-title"><ArticleIcon /> Recent Events</h3>
          <button className="view-all-btn" onClick={() => navigate('/event-log')}>
            View All <ArrowForwardIcon />
          </button>
        </div>
        <div className="events-list">
          {recentEvents.map((event) => (
            <div key={event.id} className={`event-item ${event.level.toLowerCase()}`}>
              <span className="event-icon">
                {event.level === 'Error' ? <ErrorIcon /> :
                 event.level === 'Warning' ? <WarningIcon /> : <InfoIcon />}
              </span>
              <div className="event-content">
                <span className="event-source">{event.source}</span>
                <span className="event-message">{event.message}</span>
              </div>
              <span className="event-time">{getRelativeTime(event.timestamp)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="nav-section">
        <h3 className="section-title">Quick Access</h3>
        <div className="nav-cards-grid">
          {navCards.map((card) => (
            <button
              key={card.path}
              className="nav-card"
              onClick={() => navigate(card.path)}
            >
              <span className="nav-card-icon">{card.icon}</span>
              <div className="nav-card-info">
                <span className="nav-card-label">{card.label}</span>
                <span className="nav-card-desc">{card.desc}</span>
              </div>
              <ArrowForwardIcon className="nav-card-arrow" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Main;
