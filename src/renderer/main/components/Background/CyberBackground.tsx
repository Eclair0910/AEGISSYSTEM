import React from 'react';
import './CyberBackground.scss';

const CyberBackground: React.FC = () => {
  return (
    <div className="cyber-background">
      {/* パターン1: 外側ドーナツ (750-850) - v3: ランダム弧配置 */}
      <div className="cyber-pattern-wrapper pattern-1">
        <img
          src="/images/cyber-patterns/pattern-1-v3.png"
          alt=""
          className="cyber-pattern-image"
          loading="lazy"
        />
      </div>

      {/* パターン2: 中間ドーナツ (450-550) */}
      <div className="cyber-pattern-wrapper pattern-2">
        <img
          src="/images/cyber-patterns/pattern-2-v2.png"
          alt=""
          className="cyber-pattern-image"
          loading="lazy"
        />
      </div>

      {/* パターン4: 対になる1/6弧 (350-450) - 高速回転 */}
      <div className="cyber-pattern-wrapper pattern-4">
        <img
          src="/images/cyber-patterns/pattern-4.png"
          alt=""
          className="cyber-pattern-image"
          loading="lazy"
        />
      </div>

      {/* パターン3: 内側ドーナツ (200-350) */}
      <div className="cyber-pattern-wrapper pattern-3">
        <img
          src="/images/cyber-patterns/pattern-3-v2.png"
          alt=""
          className="cyber-pattern-image"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default CyberBackground;
