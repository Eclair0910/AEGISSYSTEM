import React, { useState, useEffect } from 'react';
import './LogoAnimation.scss';

interface LogoAnimationProps {
  onAnimationComplete?: () => void;
  autoStart?: boolean;
}

const LogoAnimation: React.FC<LogoAnimationProps> = ({
  onAnimationComplete,
  autoStart = true
}) => {
  const [phase, setPhase] = useState<'idle' | 'text' | 'initials' | 'svg-spinning' | 'svg-cross' | 'complete'>('idle');
  const [isStarted, setIsStarted] = useState(false);

  // GitHub Pagesのbase pathに対応
  const basePath = import.meta.env.BASE_URL || '/';

  useEffect(() => {
    if (autoStart && !isStarted) {
      startAnimation();
    }
  }, [autoStart, isStarted]);

  const startAnimation = () => {
    setIsStarted(true);

    // Phase 1: Text appears (0-3s) - 5 words with 0.4s delay each
    setPhase('text');

    // Phase 2: Initials collect (3-4s)
    setTimeout(() => setPhase('initials'), 3000);

    // Phase 3: Wait 0.5s then show SVG spinning (4-4.5s)
    setTimeout(() => setPhase('svg-spinning'), 4500);

    // Phase 4: Show cross SVG after rotation (5.5s)
    setTimeout(() => setPhase('svg-cross'), 5500);

    // Phase 5: Complete
    setTimeout(() => {
      setPhase('complete');
      onAnimationComplete?.();
    }, 6000);
  };

  const handleReplay = () => {
    setPhase('idle');
    setIsStarted(false);
    setTimeout(() => startAnimation(), 100);
  };

  return (
    <div className="logo-animation-container">
      {/* SVG Logos */}
      {(phase === 'svg-spinning' || phase === 'svg-cross' || phase === 'complete') && (
        <div className="svg-container">
          {/* Circle SVG with afterimages */}
          <div className={`aegis-svg circle ${phase === 'svg-spinning' ? 'spinning' : ''}`}>
            <img src={`${basePath}images/logo/aegis/circle.svg`} alt="AEGIS Circle" className="svg-main" />
            {phase === 'svg-spinning' && (
              <>
                <img src={`${basePath}images/logo/aegis/circle.svg`} alt="" className="svg-afterimage afterimage-1" />
                <img src={`${basePath}images/logo/aegis/circle.svg`} alt="" className="svg-afterimage afterimage-2" />
                <img src={`${basePath}images/logo/aegis/circle.svg`} alt="" className="svg-afterimage afterimage-3" />
              </>
            )}
          </div>

          {/* Shield SVG with afterimages */}
          <div className={`aegis-svg shield ${phase === 'svg-spinning' ? 'spinning' : ''}`}>
            <img src={`${basePath}images/logo/aegis/shield.svg`} alt="AEGIS Shield" className="svg-main" />
            {phase === 'svg-spinning' && (
              <>
                <img src={`${basePath}images/logo/aegis/shield.svg`} alt="" className="svg-afterimage afterimage-1" />
                <img src={`${basePath}images/logo/aegis/shield.svg`} alt="" className="svg-afterimage afterimage-2" />
                <img src={`${basePath}images/logo/aegis/shield.svg`} alt="" className="svg-afterimage afterimage-3" />
              </>
            )}
          </div>

          {/* Cross SVG - appears after rotation */}
          {(phase === 'svg-cross' || phase === 'complete') && (
            <div className="aegis-svg cross">
              <img src={`${basePath}images/logo/aegis/cross.svg`} alt="AEGIS Cross" className="svg-main" />
            </div>
          )}
        </div>
      )}

      {/* Text content */}
      <div className={`text-content ${phase !== 'idle' ? 'visible' : ''}`}>
        <div className={`app-name ${phase === 'initials' || phase === 'svg-spinning' || phase === 'svg-cross' || phase === 'complete' ? 'collect-initials' : ''}`}>
          <div className="word-line" style={{ '--word-delay': '0s' } as React.CSSProperties}>
            <span className="char initial">A</span>
            <span className="char rest">dvanced</span>
          </div>
          <div className="word-line" style={{ '--word-delay': '0.4s' } as React.CSSProperties}>
            <span className="char initial">E</span>
            <span className="char rest">nvironment</span>
          </div>
          <div className="word-line" style={{ '--word-delay': '0.8s' } as React.CSSProperties}>
            <span className="char initial">G</span>
            <span className="char rest">uard</span>
          </div>
          <div className="word-line" style={{ '--word-delay': '1.2s' } as React.CSSProperties}>
            <span className="char initial">I</span>
            <span className="char rest">ntelligence</span>
          </div>
          <div className="word-line" style={{ '--word-delay': '1.6s' } as React.CSSProperties}>
            <span className="char initial">S</span>
            <span className="char rest">ystem</span>
          </div>
        </div>
        <div className={`initials-row ${(phase === 'initials' || phase === 'svg-spinning' || phase === 'svg-cross' || phase === 'complete') ? 'visible' : ''}`}>
          <span className="dot">.</span>
          <span className="dot">.</span>
          <span className="dot">.</span>
          <span className="dot">.</span>
          <span className="dot">.</span>
        </div>
      </div>

      {/* Replay button */}
      {phase === 'complete' && (
        <button className="replay-button" onClick={handleReplay}>
          Replay Animation
        </button>
      )}
    </div>
  );
};

export default LogoAnimation;
