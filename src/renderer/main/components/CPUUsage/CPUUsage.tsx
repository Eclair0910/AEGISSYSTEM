import React from 'react';
import ComputerIcon from '@mui/icons-material/Computer';
import { CPUInfo, CPUCoreInfo } from '../../../../types/system';
import './CPUUsage.scss';

interface CPUUsageProps {
  cpu: CPUInfo;
  cpuCores?: CPUCoreInfo[];
}

const CPUUsage: React.FC<CPUUsageProps> = ({ cpu, cpuCores }) => {
  const percentage = cpu.currentLoad.toFixed(1);

  return (
    <div className="cpu-usage">
      <div className="card-header">
        <h3>CPU Usage</h3>
        <div className="icon"><ComputerIcon /></div>
      </div>

      <div className="circular-progress">
        <svg className="progress-ring" viewBox="0 0 120 120">
          <circle className="progress-bg" cx="60" cy="60" r="54" />
          <circle
            className="progress-bar"
            cx="60"
            cy="60"
            r="54"
            style={{
              strokeDasharray: `${(parseFloat(percentage) / 100) * 339.292} 339.292`
            }}
          />
        </svg>
        <div className="progress-text">
          <div className="percentage">{percentage}%</div>
        </div>
      </div>

      <div className="cpu-details">
        {cpu.model && (
          <div className="detail-row">
            <span className="label">Model:</span>
            <span className="value model">{cpu.model}</span>
          </div>
        )}
        <div className="detail-row">
          <span className="label">Cores:</span>
          <span className="value">{cpu.cores}</span>
        </div>
        <div className="detail-row">
          <span className="label">Threads:</span>
          <span className="value">{cpu.threads}</span>
        </div>
        {cpu.speed && (
          <div className="detail-row">
            <span className="label">Clock:</span>
            <span className="value">{cpu.speed.toFixed(2)} GHz</span>
          </div>
        )}
        {cpu.temperature && (
          <div className="detail-row">
            <span className="label">Temperature:</span>
            <span className="value">{cpu.temperature.toFixed(1)}°C</span>
          </div>
        )}
        <div className="detail-row">
          <span className="label">Load:</span>
          <span className="value status">
            {parseFloat(percentage) < 30 ? 'Low' : parseFloat(percentage) < 70 ? 'Medium' : 'High'}
          </span>
        </div>
      </div>

      {/* CPU Core Usage */}
      {cpuCores && cpuCores.length > 0 && (
        <div className="cpu-cores">
          <h4>Core Usage</h4>
          <div className="cores-grid">
            {cpuCores.map((core) => (
              <div key={core.core} className="core-item">
                <div className="core-label">C{core.core}</div>
                <div className="core-bar">
                  <div
                    className="core-fill"
                    style={{ height: `${core.load}%` }}
                  />
                </div>
                <div className="core-value">{core.load.toFixed(0)}%</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CPUUsage;
