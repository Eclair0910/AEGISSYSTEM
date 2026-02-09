import React from 'react';
import ReactDOM from 'react-dom/client';
import SplashScreen from './SplashScreen';
import '../shared/styles/global.scss';
import './SplashScreen.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SplashScreen />
  </React.StrictMode>
);
