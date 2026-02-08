import React from 'react';
import { SystemInfo } from '../../../../types/system';
import MemoryUsage from '../MemoryUsage/MemoryUsage';
import CPUUsage from '../CPUUsage/CPUUsage';
import GPUUsage from '../GPUUsage/GPUUsage';
import ProcessList from '../ProcessList/ProcessList';
import PerformanceChart from '../PerformanceChart/PerformanceChart';
import './SystemMonitor.scss';

interface SystemMonitorProps {
  systemInfo: SystemInfo | null;
  isLoading: boolean;
  error: string | null;
}

const SystemMonitor: React.FC<SystemMonitorProps> = ({ systemInfo, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="system-monitor loading">
        <div className="spinner" />
        <p>システム情報を読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="system-monitor error">
        <p>{error}</p>
      </div>
    );
  }

  if (!systemInfo) {
    return null;
  }

  return (
    <div className="system-monitor">
      {/* リアルタイムグラフセクション */}
      <div className="charts-section">
        <h2 className="section-title">リアルタイムパフォーマンス</h2>
        <div className="charts-grid">
          <PerformanceChart
            title="CPU使用率"
            currentValue={systemInfo.cpu.currentLoad}
            color="#ff006e"
          />
          <PerformanceChart
            title="メモリ使用率"
            currentValue={systemInfo.memory.usedPercentage}
            color="#00d9ff"
          />
          {systemInfo.gpu && systemInfo.gpu.length > 0 && (
            <PerformanceChart
              title="GPU使用率"
              currentValue={systemInfo.gpu[0].utilizationGpu}
              color="#7b2cbf"
            />
          )}
        </div>
      </div>

      {/* システム概要セクション */}
      <div className="overview-section">
        <h2 className="section-title">システム概要</h2>
        <div className="monitor-grid">
          <MemoryUsage memory={systemInfo.memory} />
          <CPUUsage cpu={systemInfo.cpu} cpuCores={systemInfo.cpuCores} />
        </div>
      </div>

      {/* GPU情報セクション */}
      {systemInfo.gpu && systemInfo.gpu.length > 0 && (
        <div className="gpu-section">
          <h2 className="section-title">GPU情報</h2>
          <GPUUsage gpus={systemInfo.gpu} />
        </div>
      )}

      {/* プロセス一覧セクション */}
      {systemInfo.topProcesses && systemInfo.topProcesses.length > 0 && (
        <div className="processes-section">
          <ProcessList processes={systemInfo.topProcesses} />
        </div>
      )}

      <div className="timestamp">
        最終更新: {new Date(systemInfo.timestamp).toLocaleTimeString('ja-JP')}
      </div>
    </div>
  );
};

export default SystemMonitor;
