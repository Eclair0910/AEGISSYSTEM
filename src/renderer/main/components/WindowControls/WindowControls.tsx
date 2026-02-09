import React, { useState, useEffect } from 'react';
import './WindowControls.scss';

const WindowControls: React.FC = () => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    // Check if running in Electron environment
    const electronAvailable = !!(window.electronAPI?.windowControls);
    setIsElectron(electronAvailable);

    if (electronAvailable) {
      checkMaximized();
    }
  }, []);

  const checkMaximized = async () => {
    if (window.electronAPI?.windowControls?.isMaximized) {
      const maximized = await window.electronAPI.windowControls.isMaximized();
      setIsMaximized(maximized);
    }
  };

  const handleMinimize = () => {
    if (window.electronAPI?.windowControls?.minimize) {
      window.electronAPI.windowControls.minimize();
    }
  };

  const handleMaximize = async () => {
    if (window.electronAPI?.windowControls?.maximize) {
      await window.electronAPI.windowControls.maximize();
      checkMaximized();
    }
  };

  const handleClose = () => {
    if (window.electronAPI?.windowControls?.close) {
      window.electronAPI.windowControls.close();
    }
  };

  // Don't render in browser environment
  if (!isElectron) {
    return null;
  }

  return (
    <div className="window-controls-wrapper">
      <div className="title-bar draggable">
        <div className="app-title">AEGIS System</div>
        <div className="window-controls non-draggable">
          <button
            className="window-control-button minimize"
            onClick={handleMinimize}
            aria-label="Minimize"
          >
            <svg width="12" height="12" viewBox="0 0 12 12">
              <line x1="0" y1="6" x2="12" y2="6" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
          <button
            className="window-control-button maximize"
            onClick={handleMaximize}
            aria-label={isMaximized ? 'Restore' : 'Maximize'}
          >
            {isMaximized ? (
              <svg width="12" height="12" viewBox="0 0 12 12">
                <rect x="2" y="0" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="0" y="2" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 12 12">
                <rect x="0" y="0" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            )}
          </button>
          <button
            className="window-control-button close"
            onClick={handleClose}
            aria-label="Close"
          >
            <svg width="12" height="12" viewBox="0 0 12 12">
              <line x1="0" y1="0" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
              <line x1="12" y1="0" x2="0" y2="12" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WindowControls;
