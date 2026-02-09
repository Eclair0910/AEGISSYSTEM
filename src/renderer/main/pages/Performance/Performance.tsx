import React from 'react';
import { SystemInfo } from '../../../../types/system';
import MemoryUsage from '../../components/MemoryUsage/MemoryUsage';
import CPUUsage from '../../components/CPUUsage/CPUUsage';
import GPUUsage from '../../components/GPUUsage/GPUUsage';
import ProcessList from '../../components/ProcessList/ProcessList';
import PerformanceChart from '../../components/PerformanceChart/PerformanceChart';
import './Performance.scss';

interface PerformanceProps {
  systemInfo: SystemInfo | null;
  isLoading: boolean;
  error: string | null;
}

const Performance: React.FC<PerformanceProps> = ({ systemInfo, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="performance-page loading">
        <div className="spinner" />
        <p>Loading system information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="performance-page error">
        <p>{error}</p>
      </div>
    );
  }

  if (!systemInfo) {
    return null;
  }

  return (
    <div className="performance-page">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Performance</h1>
      </div>

      {/* Real-time Charts Section */}
      <div className="charts-section">
        <h2 className="section-title">Real-time Performance</h2>
        <div className="charts-grid">
          <PerformanceChart
            title="CPU Usage"
            currentValue={systemInfo.cpu.currentLoad}
            color="#ff006e"
          />
          <PerformanceChart
            title="Memory Usage"
            currentValue={systemInfo.memory.usedPercentage}
            color="#00d9ff"
          />
          {systemInfo.gpu && systemInfo.gpu.length > 0 && (
            <PerformanceChart
              title="GPU Usage"
              currentValue={systemInfo.gpu[0].utilizationGpu}
              color="#7b2cbf"
            />
          )}
        </div>
      </div>

      {/* System Overview Section */}
      <div className="overview-section">
        <h2 className="section-title">System Overview</h2>
        <div className="monitor-grid">
          <MemoryUsage memory={systemInfo.memory} />
          <CPUUsage cpu={systemInfo.cpu} cpuCores={systemInfo.cpuCores} />
        </div>
      </div>

      {/* GPU Information Section */}
      {systemInfo.gpu && systemInfo.gpu.length > 0 && (
        <div className="gpu-section">
          <h2 className="section-title">GPU Information</h2>
          <GPUUsage gpus={systemInfo.gpu} />
        </div>
      )}

      {/* Process List Section */}
      {systemInfo.topProcesses && systemInfo.topProcesses.length > 0 && (
        <div className="processes-section">
          <ProcessList processes={systemInfo.topProcesses} />
        </div>
      )}

      <div className="timestamp">
        Last Updated: {new Date(systemInfo.timestamp).toLocaleTimeString('en-US')}
      </div>
    </div>
  );
};

export default Performance;
