import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WindowControls from './components/WindowControls/WindowControls';
import CyberBackground from './components/Background/CyberBackground';
import Sidebar from './components/Sidebar/Sidebar';
import Main from './pages/Main/Main';
import Performance from './pages/Performance/Performance';
import Test from './pages/Test/Test';
import Logo from './pages/Logo/Logo';
import SystemInfo from './pages/SystemInfo/SystemInfo';
import EventLog from './pages/EventLog/EventLog';
import DiskAnalyzer from './pages/DiskAnalyzer/DiskAnalyzer';
import { useSystemInfo } from './hooks/useSystemInfo';

const App: React.FC = () => {
  const { systemInfo, isLoading, error } = useSystemInfo(1000);

  return (
    <Router>
      <div className="app">
        <CyberBackground />
        <WindowControls />
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/main" element={<Main />} />
              <Route
                path="/performance"
                element={
                  <Performance
                    systemInfo={systemInfo}
                    isLoading={isLoading}
                    error={error}
                  />
                }
              />
              <Route path="/test" element={<Test />} />
              <Route path="/logo" element={<Logo />} />
              <Route path="/system-info" element={<SystemInfo />} />
              <Route path="/event-log" element={<EventLog />} />
              <Route path="/disk-analyzer" element={<DiskAnalyzer />} />
              <Route path="/" element={<Navigate to="/main" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
