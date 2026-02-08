import React from 'react';
import LogoAnimation from '../../components/LogoAnimation/LogoAnimation';
import './Logo.scss';

const Logo: React.FC = () => {
  return (
    <div className="logo-page">
      <div className="page-header">
        <h1 className="page-title">Logo Animation</h1>
      </div>
      <div className="animation-container">
        <LogoAnimation autoStart={true} />
      </div>
    </div>
  );
};

export default Logo;
