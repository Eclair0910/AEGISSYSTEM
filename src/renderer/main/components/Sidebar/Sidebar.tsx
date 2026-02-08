import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import SpeedIcon from '@mui/icons-material/Speed';
import ScienceIcon from '@mui/icons-material/Science';
import ComputerIcon from '@mui/icons-material/Computer';
import ArticleIcon from '@mui/icons-material/Article';
import PieChartIcon from '@mui/icons-material/PieChart';
import ShieldIcon from '@mui/icons-material/Shield';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import './Sidebar.scss';

interface MenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  { path: '/main', label: 'Main', icon: <HomeIcon /> },
  { path: '/performance', label: 'Performance', icon: <SpeedIcon /> },
  { path: '/system-info', label: 'System Info', icon: <ComputerIcon /> },
  { path: '/event-log', label: 'Event Log', icon: <ArticleIcon /> },
  { path: '/disk-analyzer', label: 'Disk Analyzer', icon: <PieChartIcon /> },
  { path: '/logo', label: 'Logo', icon: <ShieldIcon /> },
  { path: '/test', label: 'Test', icon: <ScienceIcon /> },
];

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Toggle */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isCollapsed ? <MenuIcon /> : <MenuOpenIcon />}
      </button>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => handleNavigation(item.path)}
            title={isCollapsed ? item.label : undefined}
          >
            <span className="nav-icon">{item.icon}</span>
            {!isCollapsed && <span className="nav-label">{item.label}</span>}
            {location.pathname === item.path && <span className="active-bar" />}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button className="nav-item" title={isCollapsed ? 'Settings' : undefined}>
          <span className="nav-icon"><SettingsIcon /></span>
          {!isCollapsed && <span className="nav-label">Settings</span>}
        </button>
        <div className="status">
          <span className="status-dot" />
          {!isCollapsed && <span className="status-text">Online</span>}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
