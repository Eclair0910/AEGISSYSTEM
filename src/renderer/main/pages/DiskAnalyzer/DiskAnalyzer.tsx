import React, { useEffect, useState } from 'react';
import StorageIcon from '@mui/icons-material/Storage';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import DescriptionIcon from '@mui/icons-material/Description';
import CodeIcon from '@mui/icons-material/Code';
import ArchiveIcon from '@mui/icons-material/Archive';
import RefreshIcon from '@mui/icons-material/Refresh';
import './DiskAnalyzer.scss';

interface DriveInfo {
  letter: string;
  label: string;
  type: 'HDD' | 'SSD' | 'NVMe' | 'Removable' | 'Network';
  totalSize: number;
  usedSize: number;
  freeSize: number;
  fileSystem: string;
}

interface FileTypeBreakdown {
  type: string;
  size: number;
  count: number;
  icon: React.ReactNode;
  color: string;
}

interface LargeFile {
  name: string;
  path: string;
  size: number;
  modified: string;
}

const DiskAnalyzer: React.FC = () => {
  const [drives, setDrives] = useState<DriveInfo[]>([]);
  const [selectedDrive, setSelectedDrive] = useState<string | null>(null);
  const [fileTypes, setFileTypes] = useState<FileTypeBreakdown[]>([]);
  const [largeFiles, setLargeFiles] = useState<LargeFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getUsagePercent = (used: number, total: number): number => {
    return Math.round((used / total) * 100);
  };

  const getUsageColor = (percent: number): string => {
    if (percent >= 90) return '#ff4444';
    if (percent >= 70) return '#ffaa00';
    return '#00d4ff';
  };

  const fetchDrives = async () => {
    setIsLoading(true);
    try {
      if (window.electronAPI?.getDriveInfo) {
        const driveData = await window.electronAPI.getDriveInfo();
        setDrives(driveData);
        if (driveData.length > 0) {
          setSelectedDrive(driveData[0].letter);
        }
      } else {
        // Mock data for browser development
        const mockDrives: DriveInfo[] = [
          {
            letter: 'C:',
            label: 'System',
            type: 'NVMe',
            totalSize: 512 * 1024 * 1024 * 1024,
            usedSize: 387 * 1024 * 1024 * 1024,
            freeSize: 125 * 1024 * 1024 * 1024,
            fileSystem: 'NTFS',
          },
          {
            letter: 'D:',
            label: 'Data',
            type: 'HDD',
            totalSize: 2 * 1024 * 1024 * 1024 * 1024,
            usedSize: 1.2 * 1024 * 1024 * 1024 * 1024,
            freeSize: 0.8 * 1024 * 1024 * 1024 * 1024,
            fileSystem: 'NTFS',
          },
          {
            letter: 'E:',
            label: 'Games',
            type: 'SSD',
            totalSize: 1024 * 1024 * 1024 * 1024,
            usedSize: 756 * 1024 * 1024 * 1024,
            freeSize: 268 * 1024 * 1024 * 1024,
            fileSystem: 'NTFS',
          },
        ];
        setDrives(mockDrives);
        setSelectedDrive('C:');

        // Mock file type breakdown
        const mockFileTypes: FileTypeBreakdown[] = [
          { type: 'Images', size: 45 * 1024 * 1024 * 1024, count: 12543, icon: <ImageIcon />, color: '#4CAF50' },
          { type: 'Videos', size: 120 * 1024 * 1024 * 1024, count: 234, icon: <VideoFileIcon />, color: '#2196F3' },
          { type: 'Audio', size: 28 * 1024 * 1024 * 1024, count: 3421, icon: <AudioFileIcon />, color: '#9C27B0' },
          { type: 'Documents', size: 15 * 1024 * 1024 * 1024, count: 8932, icon: <DescriptionIcon />, color: '#FF9800' },
          { type: 'Code', size: 8 * 1024 * 1024 * 1024, count: 45231, icon: <CodeIcon />, color: '#00BCD4' },
          { type: 'Archives', size: 35 * 1024 * 1024 * 1024, count: 567, icon: <ArchiveIcon />, color: '#795548' },
          { type: 'Other', size: 136 * 1024 * 1024 * 1024, count: 23456, icon: <InsertDriveFileIcon />, color: '#607D8B' },
        ];
        setFileTypes(mockFileTypes);

        // Mock large files
        const mockLargeFiles: LargeFile[] = [
          { name: 'Windows.old', path: 'C:\\Windows.old', size: 25 * 1024 * 1024 * 1024, modified: '2024-01-15' },
          { name: 'hiberfil.sys', path: 'C:\\hiberfil.sys', size: 16 * 1024 * 1024 * 1024, modified: '2024-02-01' },
          { name: 'pagefile.sys', path: 'C:\\pagefile.sys', size: 12 * 1024 * 1024 * 1024, modified: '2024-02-04' },
          { name: 'game_backup.zip', path: 'D:\\Backups\\game_backup.zip', size: 8.5 * 1024 * 1024 * 1024, modified: '2024-01-20' },
          { name: 'project_archive.7z', path: 'D:\\Archives\\project_archive.7z', size: 6.2 * 1024 * 1024 * 1024, modified: '2024-01-28' },
        ];
        setLargeFiles(mockLargeFiles);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  const analyzeDrive = async () => {
    setIsAnalyzing(true);
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsAnalyzing(false);
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  const totalFileSize = fileTypes.reduce((sum, ft) => sum + ft.size, 0);

  if (isLoading) {
    return (
      <div className="disk-analyzer-page loading">
        <div className="spinner" />
        <p>Loading disk information...</p>
      </div>
    );
  }

  return (
    <div className="disk-analyzer-page">
      <div className="page-header">
        <h1 className="page-title">Disk Analyzer</h1>
        <button className="refresh-button" onClick={fetchDrives}>
          <RefreshIcon />
          <span>Refresh</span>
        </button>
      </div>

      {/* Drive Overview */}
      <div className="drives-section">
        <div className="section-header">
          <StorageIcon className="section-icon" />
          <h2>Storage Drives</h2>
        </div>
        <div className="drives-grid">
          {drives.map((drive) => {
            const usagePercent = getUsagePercent(drive.usedSize, drive.totalSize);
            const usageColor = getUsageColor(usagePercent);
            return (
              <div
                key={drive.letter}
                className={`drive-card ${selectedDrive === drive.letter ? 'selected' : ''}`}
                onClick={() => setSelectedDrive(drive.letter)}
              >
                <div className="drive-header">
                  <StorageIcon className="drive-icon" />
                  <div className="drive-info">
                    <span className="drive-letter">{drive.letter}</span>
                    <span className="drive-label">{drive.label}</span>
                  </div>
                  <span className="drive-type">{drive.type}</span>
                </div>
                <div className="drive-usage">
                  <div className="usage-bar">
                    <div
                      className="usage-fill"
                      style={{
                        width: `${usagePercent}%`,
                        backgroundColor: usageColor,
                      }}
                    />
                  </div>
                  <div className="usage-text">
                    <span>{formatSize(drive.usedSize)} used</span>
                    <span>{formatSize(drive.freeSize)} free</span>
                  </div>
                </div>
                <div className="drive-footer">
                  <span className="total-size">{formatSize(drive.totalSize)}</span>
                  <span className="file-system">{drive.fileSystem}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analysis Section */}
      <div className="analysis-section">
        <div className="file-types-panel">
          <div className="panel-header">
            <FolderIcon className="panel-icon" />
            <h3>File Types</h3>
            <button
              className="analyze-button"
              onClick={analyzeDrive}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
          <div className="file-types-list">
            {fileTypes.map((ft) => {
              const percent = (ft.size / totalFileSize) * 100;
              return (
                <div key={ft.type} className="file-type-item">
                  <div className="file-type-icon" style={{ color: ft.color }}>
                    {ft.icon}
                  </div>
                  <div className="file-type-info">
                    <div className="file-type-header">
                      <span className="file-type-name">{ft.type}</span>
                      <span className="file-type-size">{formatSize(ft.size)}</span>
                    </div>
                    <div className="file-type-bar">
                      <div
                        className="file-type-fill"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: ft.color,
                        }}
                      />
                    </div>
                    <span className="file-type-count">{ft.count.toLocaleString()} files</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="large-files-panel">
          <div className="panel-header">
            <InsertDriveFileIcon className="panel-icon" />
            <h3>Largest Files</h3>
          </div>
          <div className="large-files-list">
            {largeFiles.map((file, index) => (
              <div key={index} className="large-file-item">
                <div className="file-rank">#{index + 1}</div>
                <div className="file-details">
                  <span className="file-name">{file.name}</span>
                  <span className="file-path">{file.path}</span>
                </div>
                <div className="file-meta">
                  <span className="file-size">{formatSize(file.size)}</span>
                  <span className="file-modified">{file.modified}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Storage Summary */}
      <div className="summary-section">
        <div className="summary-card">
          <div className="summary-label">Total Storage</div>
          <div className="summary-value">
            {formatSize(drives.reduce((sum, d) => sum + d.totalSize, 0))}
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Used Space</div>
          <div className="summary-value">
            {formatSize(drives.reduce((sum, d) => sum + d.usedSize, 0))}
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Free Space</div>
          <div className="summary-value">
            {formatSize(drives.reduce((sum, d) => sum + d.freeSize, 0))}
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Total Drives</div>
          <div className="summary-value">{drives.length}</div>
        </div>
      </div>
    </div>
  );
};

export default DiskAnalyzer;
