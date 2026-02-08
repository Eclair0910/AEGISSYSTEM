import React, { useState, useEffect } from 'react';
import './AegisLogoAnimation.scss';

interface AegisLogoAnimationProps {
  onAnimationComplete?: () => void;
  autoStart?: boolean;
}

const AegisLogoAnimation: React.FC<AegisLogoAnimationProps> = ({
  onAnimationComplete,
  autoStart = true
}) => {
  const [phase, setPhase] = useState<'idle' | 'circle' | 'shield' | 'cross' | 'text' | 'sparkle' | 'complete'>('idle');
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    if (autoStart && !isStarted) {
      startAnimation();
    }
  }, [autoStart, isStarted]);

  const startAnimation = () => {
    setIsStarted(true);

    // Phase 1: Circle appears with rotation (0-0.8s)
    setPhase('circle');

    // Phase 2: Shield appears (0.8s)
    setTimeout(() => setPhase('shield'), 800);

    // Phase 3: Cross appears (1.6s)
    setTimeout(() => setPhase('cross'), 1600);

    // Phase 4: Text appears (2.4s)
    setTimeout(() => setPhase('text'), 2400);

    // Phase 5: Sparkle effect (3.2s)
    setTimeout(() => setPhase('sparkle'), 3200);

    // Complete (5s)
    setTimeout(() => {
      setPhase('complete');
      onAnimationComplete?.();
    }, 5000);
  };

  const handleReplay = () => {
    setPhase('idle');
    setIsStarted(false);
    setTimeout(() => startAnimation(), 100);
  };

  const isVisible = (part: string) => {
    const phases = ['idle', 'circle', 'shield', 'cross', 'text', 'sparkle', 'complete'];
    const partIndex = phases.indexOf(part);
    const currentIndex = phases.indexOf(phase);
    return currentIndex >= partIndex;
  };

  return (
    <div className="aegis-logo-animation">
      <div className={`aegis-container phase-${phase}`}>
        {/* Circle - 外周弧装飾 */}
        <div className={`aegis-part circle ${isVisible('circle') ? 'visible' : ''}`}>
          <img src="/images/logo/aegis/circle.svg" alt="" />
        </div>

        {/* Shield - 盾 */}
        <div className={`aegis-part shield ${isVisible('shield') ? 'visible' : ''}`}>
          <img src="/images/logo/aegis/shield.svg" alt="" />
        </div>

        {/* Cross - 十字架 */}
        <div className={`aegis-part cross ${isVisible('cross') ? 'visible' : ''}`}>
          <img src="/images/logo/aegis/cross.svg" alt="" />
        </div>

        {/* Text - 文字 */}
        <div className={`aegis-part text ${isVisible('text') ? 'visible' : ''}`}>
          <img src="/images/logo/aegis/text.svg" alt="" />
        </div>

        {/* Sparkle overlay */}
        {(phase === 'sparkle' || phase === 'complete') && (
          <div className="sparkle-container">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="sparkle"
                style={{
                  '--sparkle-x': `${Math.random() * 100}%`,
                  '--sparkle-y': `${Math.random() * 100}%`,
                  '--sparkle-delay': `${Math.random() * 2}s`,
                  '--sparkle-duration': `${1.5 + Math.random() * 1.5}s`,
                  '--sparkle-size': `${2 + Math.random() * 4}px`,
                } as React.CSSProperties}
              />
            ))}
          </div>
        )}
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

export default AegisLogoAnimation;
