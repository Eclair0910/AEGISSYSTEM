import React from 'react';
import LogoAnimation from '../../components/LogoAnimation/LogoAnimation';
import './Test.scss';

const Test: React.FC = () => {
  return (
    <div className="test-page">
      <div className="page-header">
        <h1 className="page-title">Logo Animation Test</h1>
      </div>
      <div className="animation-container">
        <LogoAnimation autoStart={true} />
      </div>
    </div>
  );
};

export default Test;
