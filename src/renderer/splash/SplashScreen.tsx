import React, { useState, useEffect } from 'react';

const SplashScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2500; // 2.5秒
    const interval = 30; // 30msごとに更新
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(prev + increment, 100);
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // SVG円形プログレスバーの計算
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <svg className="progress-ring" width="300" height="300">
          <circle
            className="progress-ring-circle-bg"
            r={radius}
            cx="150"
            cy="150"
          />
          <circle
            className="progress-ring-circle"
            r={radius}
            cx="150"
            cy="150"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset
            }}
          />
        </svg>
        <div className="progress-content">
          <div className="percentage">{Math.round(progress)}%</div>
          <div className="app-name">AEGISSystem</div>
          <div className="loading-text">Initializing...</div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
