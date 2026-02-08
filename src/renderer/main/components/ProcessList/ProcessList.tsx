import React from 'react';
import { ProcessMemoryInfo } from '../../../../types/system';
import './ProcessList.scss';

interface ProcessListProps {
  processes: ProcessMemoryInfo[];
}

const ProcessList: React.FC<ProcessListProps> = ({ processes }) => {
  const formatBytes = (bytes: number): string => {
    const gb = bytes / (1024 ** 3);
    if (gb >= 1) {
      return `${gb.toFixed(2)} GB`;
    }
    const mb = bytes / (1024 ** 2);
    return `${mb.toFixed(0)} MB`;
  };

  return (
    <div className="process-list">
      <div className="process-header">
        <h3>Top Memory Processes</h3>
      </div>
      <div className="process-table">
        <div className="table-header">
          <div className="col-name">Process Name</div>
          <div className="col-pid">PID</div>
          <div className="col-memory">Memory</div>
          <div className="col-percent">Usage</div>
        </div>
        <div className="table-body">
          {processes.map((process) => (
            <div key={process.pid} className="table-row">
              <div className="col-name">{process.name}</div>
              <div className="col-pid">{process.pid}</div>
              <div className="col-memory">{formatBytes(process.mem)}</div>
              <div className="col-percent">
                <div className="percent-bar">
                  <div
                    className="percent-fill"
                    style={{ width: `${Math.min(process.memPercentage, 100)}%` }}
                  />
                </div>
                <span>{process.memPercentage.toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProcessList;
