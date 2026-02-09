import React from 'react';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import { GPUInfo } from '../../../../types/system';
import './GPUUsage.scss';

interface GPUUsageProps {
  gpus: GPUInfo[];
}

const GPUUsage: React.FC<GPUUsageProps> = ({ gpus }) => {
  const formatBytes = (bytes: number): string => {
    const gb = bytes / (1024 ** 3);
    return gb.toFixed(2);
  };

  return (
    <div className="gpu-usage-container">
      {gpus.map((gpu, index) => {
        const gpuLoad = gpu.utilizationGpu.toFixed(1);
        const memLoad = gpu.utilizationMemory.toFixed(1);

        return (
          <div key={index} className="gpu-usage">
            <div className="card-header">
              <div>
                <h3>GPU {index}</h3>
                <p className="gpu-model">{gpu.model}</p>
              </div>
              <div className="icon"><VideogameAssetIcon /></div>
            </div>

            <div className="gpu-metrics">
              {/* GPU Usage */}
              <div className="metric-item">
                <div className="metric-label">GPU Usage</div>
                <div className="metric-value">
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar gpu-bar"
                      style={{ width: `${gpuLoad}%` }}
                    />
                  </div>
                  <span className="percentage">{gpuLoad}%</span>
                </div>
              </div>

              {/* Memory Usage */}
              <div className="metric-item">
                <div className="metric-label">Memory Usage</div>
                <div className="metric-value">
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar memory-bar"
                      style={{ width: `${memLoad}%` }}
                    />
                  </div>
                  <span className="percentage">{memLoad}%</span>
                </div>
              </div>
            </div>

            <div className="gpu-details">
              <div className="detail-row">
                <span className="label">Vendor:</span>
                <span className="value">{gpu.vendor}</span>
              </div>
              <div className="detail-row">
                <span className="label">Dedicated Memory:</span>
                <span className="value">{formatBytes(gpu.memoryTotal)} GB</span>
              </div>
              <div className="detail-row">
                <span className="label">Used Memory:</span>
                <span className="value">{formatBytes(gpu.memoryUsed)} GB</span>
              </div>
              {gpu.temperatureGpu && (
                <div className="detail-row">
                  <span className="label">Temperature:</span>
                  <span className="value">{gpu.temperatureGpu.toFixed(1)}°C</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GPUUsage;
