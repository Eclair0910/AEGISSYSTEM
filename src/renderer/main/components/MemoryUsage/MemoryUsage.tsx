import React from 'react';
import MemoryIcon from '@mui/icons-material/Memory';
import { MemoryInfo } from '../../../../types/system';
import './MemoryUsage.scss';

interface MemoryUsageProps {
  memory: MemoryInfo;
}

const MemoryUsage: React.FC<MemoryUsageProps> = ({ memory }) => {
  const formatBytes = (bytes: number): string => {
    const gb = bytes / (1024 ** 3);
    return gb.toFixed(2);
  };

  const percentage = memory.usedPercentage.toFixed(1);

  return (
    <div className="memory-usage">
      <div className="card-header">
        <h3>Memory Usage</h3>
        <div className="icon"><MemoryIcon /></div>
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

      <div className="memory-details">
        <div className="detail-row">
          <span className="label">Used:</span>
          <span className="value">{formatBytes(memory.used)} GB</span>
        </div>
        <div className="detail-row">
          <span className="label">Total:</span>
          <span className="value">{formatBytes(memory.total)} GB</span>
        </div>
        <div className="detail-row">
          <span className="label">Free:</span>
          <span className="value">{formatBytes(memory.free)} GB</span>
        </div>
      </div>
    </div>
  );
};

export default MemoryUsage;
