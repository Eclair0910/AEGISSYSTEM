import React, { useEffect, useState } from 'react';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import './EventLog.scss';

type EventLevel = 'Error' | 'Warning' | 'Information';

interface EventLogEntry {
  id: number;
  level: EventLevel;
  source: string;
  eventId: number;
  message: string;
  timestamp: string;
  category: string;
}

const EventLog: React.FC = () => {
  const [events, setEvents] = useState<EventLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<EventLevel | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      if (window.electronAPI?.getEventLogs) {
        const logs = await window.electronAPI.getEventLogs();
        setEvents(logs);
      } else {
        // Mock data for browser development
        const mockEvents: EventLogEntry[] = [
          {
            id: 1,
            level: 'Error',
            source: 'Application Error',
            eventId: 1000,
            message: 'Faulting application name: explorer.exe, version: 10.0.22621.1, time stamp: 0x5dc8b08e',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            category: 'Application',
          },
          {
            id: 2,
            level: 'Warning',
            source: 'Microsoft-Windows-Kernel-Power',
            eventId: 109,
            message: 'The kernel power manager has initiated a shutdown transition.',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            category: 'System',
          },
          {
            id: 3,
            level: 'Information',
            source: 'Service Control Manager',
            eventId: 7036,
            message: 'The Windows Update service entered the running state.',
            timestamp: new Date(Date.now() - 10800000).toISOString(),
            category: 'System',
          },
          {
            id: 4,
            level: 'Error',
            source: 'DCOM',
            eventId: 10016,
            message: 'The application-specific permission settings do not grant Local Activation permission for the COM Server application.',
            timestamp: new Date(Date.now() - 14400000).toISOString(),
            category: 'System',
          },
          {
            id: 5,
            level: 'Warning',
            source: 'Microsoft-Windows-Security-SPP',
            eventId: 903,
            message: 'The Software Protection service has completed licensing status check.',
            timestamp: new Date(Date.now() - 18000000).toISOString(),
            category: 'Application',
          },
          {
            id: 6,
            level: 'Information',
            source: 'Microsoft-Windows-Winlogon',
            eventId: 7001,
            message: 'User Logon Notification for Customer Experience Improvement Program.',
            timestamp: new Date(Date.now() - 21600000).toISOString(),
            category: 'System',
          },
          {
            id: 7,
            level: 'Error',
            source: 'Disk',
            eventId: 11,
            message: 'The driver detected a controller error on \\Device\\Harddisk1\\DR1.',
            timestamp: new Date(Date.now() - 25200000).toISOString(),
            category: 'System',
          },
          {
            id: 8,
            level: 'Warning',
            source: 'Microsoft-Windows-DistributedCOM',
            eventId: 10010,
            message: 'The server {GUID} did not register with DCOM within the required timeout.',
            timestamp: new Date(Date.now() - 28800000).toISOString(),
            category: 'System',
          },
          {
            id: 9,
            level: 'Information',
            source: 'EventLog',
            eventId: 6013,
            message: 'The system uptime is 259200 seconds.',
            timestamp: new Date(Date.now() - 32400000).toISOString(),
            category: 'System',
          },
          {
            id: 10,
            level: 'Error',
            source: 'NETLOGON',
            eventId: 5719,
            message: 'This computer was not able to set up a secure session with a domain controller in domain.',
            timestamp: new Date(Date.now() - 36000000).toISOString(),
            category: 'System',
          },
          {
            id: 11,
            level: 'Information',
            source: 'Windows Update',
            eventId: 19,
            message: 'Installation Successful: Windows successfully installed the following update: Security Update for Windows (KB5034441)',
            timestamp: new Date(Date.now() - 40000000).toISOString(),
            category: 'Application',
          },
          {
            id: 12,
            level: 'Warning',
            source: 'Time-Service',
            eventId: 134,
            message: 'NtpClient was unable to set a manual peer to use as a time source because of DNS resolution error.',
            timestamp: new Date(Date.now() - 45000000).toISOString(),
            category: 'System',
          },
        ];
        setEvents(mockEvents);
      }
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch event logs');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const getLevelIcon = (level: EventLevel) => {
    switch (level) {
      case 'Error':
        return <ErrorIcon className="level-icon error" />;
      case 'Warning':
        return <WarningIcon className="level-icon warning" />;
      case 'Information':
        return <InfoIcon className="level-icon info" />;
    }
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getRelativeTime = (timestamp: string): string => {
    const now = Date.now();
    const then = new Date(timestamp).getTime();
    const diff = now - then;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredEvents = events.filter((event) => {
    const levelMatch = selectedLevel === 'All' || event.level === selectedLevel;
    const categoryMatch = selectedCategory === 'All' || event.category === selectedCategory;
    const searchMatch = searchQuery === '' ||
      event.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.source.toLowerCase().includes(searchQuery.toLowerCase());
    return levelMatch && categoryMatch && searchMatch;
  });

  const categories = ['All', ...new Set(events.map((e) => e.category))];

  const eventCounts = {
    Error: events.filter((e) => e.level === 'Error').length,
    Warning: events.filter((e) => e.level === 'Warning').length,
    Information: events.filter((e) => e.level === 'Information').length,
  };

  const toggleExpand = (id: number) => {
    setExpandedEvent(expandedEvent === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="event-log-page loading">
        <div className="spinner" />
        <p>Loading event logs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="event-log-page error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="event-log-page">
      <div className="page-header">
        <h1 className="page-title">Event Log Viewer</h1>
        <button className="refresh-button" onClick={fetchEvents}>
          <RefreshIcon />
          <span>Refresh</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div
          className={`summary-card error ${selectedLevel === 'Error' ? 'selected' : ''}`}
          onClick={() => setSelectedLevel(selectedLevel === 'Error' ? 'All' : 'Error')}
        >
          <div className="card-icon-wrapper error">
            <ErrorIcon className="card-icon" />
          </div>
          <div className="card-content">
            <span className="count">{eventCounts.Error}</span>
            <span className="label">Errors</span>
          </div>
        </div>
        <div
          className={`summary-card warning ${selectedLevel === 'Warning' ? 'selected' : ''}`}
          onClick={() => setSelectedLevel(selectedLevel === 'Warning' ? 'All' : 'Warning')}
        >
          <div className="card-icon-wrapper warning">
            <WarningIcon className="card-icon" />
          </div>
          <div className="card-content">
            <span className="count">{eventCounts.Warning}</span>
            <span className="label">Warnings</span>
          </div>
        </div>
        <div
          className={`summary-card info ${selectedLevel === 'Information' ? 'selected' : ''}`}
          onClick={() => setSelectedLevel(selectedLevel === 'Information' ? 'All' : 'Information')}
        >
          <div className="card-icon-wrapper info">
            <InfoIcon className="card-icon" />
          </div>
          <div className="card-content">
            <span className="count">{eventCounts.Information}</span>
            <span className="label">Information</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="filters-section">
        <div className="search-box">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-controls">
          <FilterListIcon className="filter-icon" />
          <div className="filter-group">
            <label>Level:</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as EventLevel | 'All')}
            >
              <option value="All">All Levels</option>
              <option value="Error">Error</option>
              <option value="Warning">Warning</option>
              <option value="Information">Information</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <span className="result-count">{filteredEvents.length} events</span>
        </div>
      </div>

      {/* Event List */}
      <div className="event-list">
        <div className="event-header">
          <span className="col-level">Level</span>
          <span className="col-timestamp">Date/Time</span>
          <span className="col-source">Source</span>
          <span className="col-eventid">Event ID</span>
          <span className="col-message">Message</span>
          <span className="col-expand"></span>
        </div>
        {filteredEvents.map((event) => (
          <div key={event.id} className={`event-item ${event.level.toLowerCase()}`}>
            <div
              className="event-row"
              onClick={() => toggleExpand(event.id)}
            >
              <span className="col-level">{getLevelIcon(event.level)}</span>
              <span className="col-timestamp">
                <span className="full-time">{formatTimestamp(event.timestamp)}</span>
                <span className="relative-time">{getRelativeTime(event.timestamp)}</span>
              </span>
              <span className="col-source">{event.source}</span>
              <span className="col-eventid">{event.eventId}</span>
              <span className="col-message">{event.message}</span>
              <span className="col-expand">
                {expandedEvent === event.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </span>
            </div>
            {expandedEvent === event.id && (
              <div className="event-details">
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Event ID</span>
                    <span className="detail-value">{event.eventId}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Source</span>
                    <span className="detail-value">{event.source}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Category</span>
                    <span className="detail-value">{event.category}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Level</span>
                    <span className={`detail-value level-badge ${event.level.toLowerCase()}`}>
                      {event.level}
                    </span>
                  </div>
                </div>
                <div className="detail-message">
                  <span className="detail-label">Full Message</span>
                  <p className="message-text">{event.message}</p>
                </div>
              </div>
            )}
          </div>
        ))}
        {filteredEvents.length === 0 && (
          <div className="no-events">
            <SearchIcon className="no-events-icon" />
            <p>No events match the current filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventLog;
