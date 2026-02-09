import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '../shared/styles/global.scss';
import './App.scss';

// ブラウザ環境用のモックAPIを読み込む
import './mock/electronAPI';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
