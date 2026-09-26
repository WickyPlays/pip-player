import { useState, useEffect } from 'react';
import { IoRefreshOutline, IoDownloadOutline, IoCheckmarkOutline, IoInformationCircleOutline } from 'react-icons/io5';
import './SettingsUpdates.scss';

interface UpdateInfo {
  version: string;
  releaseNotes?: string;
  releaseDate?: string;
}

interface UpdateStatus {
  status: 'checking' | 'available' | 'not-available' | 'error' | 'downloading' | 'downloaded';
  info?: UpdateInfo;
  error?: string;
  progress?: {
    percent: number;
    bytesPerSecond: number;
    transferred: number;
    total: number;
  };
}

export default function SettingsUpdates() {
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus | null>(null);
  const [currentVersion, setCurrentVersion] = useState<string>('');

  useEffect(() => {
    // Get current app version
    const fetchVersion = async () => {
      try {
        const version = await window.electron.getAppVersion();
        setCurrentVersion(version);
      } catch (error) {
        console.error('Failed to get app version:', error);
        setCurrentVersion('Unknown');
      }
    };

    fetchVersion();

    const handleUpdateStatus = (...args: unknown[]) => {
      const status = args[1] as UpdateStatus;
      setUpdateStatus(status);
    };

    window.electron.ipcRenderer.on('update-status', handleUpdateStatus);

    return () => {
      window.electron.ipcRenderer.removeListener('update-status', handleUpdateStatus);
    };
  }, []);

  const handleCheckForUpdates = () => {
    setUpdateStatus({ status: 'checking' });
    window.electron.ipcRenderer.send('check-for-updates');
  };

  const handleDownload = () => {
    window.electron.ipcRenderer.send('download-update');
  };

  const handleInstall = () => {
    window.electron.ipcRenderer.send('install-update');
  };

  const renderStatus = () => {
    if (!updateStatus) {
      return (
        <div className="update-status-info">
          <IoInformationCircleOutline />
          <span>Click "Check for Updates" to see if a new version is available.</span>
        </div>
      );
    }

    switch (updateStatus.status) {
      case 'checking':
        return (
          <div className="update-status-checking">
            <IoRefreshOutline className="spinning" />
            <span>Checking for updates...</span>
          </div>
        );

      case 'available':
        return (
          <div className="update-status-available">
            <div className="update-info">
              <h3>New version available: v{updateStatus.info?.version}</h3>
              {updateStatus.info?.releaseNotes && (
                <p className="release-notes">{updateStatus.info.releaseNotes}</p>
              )}
              {updateStatus.info?.releaseDate && (
                <small>Released: {new Date(updateStatus.info.releaseDate).toLocaleDateString()}</small>
              )}
            </div>
            <button className="btn-download" onClick={handleDownload}>
              <IoDownloadOutline />
              Download Update
            </button>
          </div>
        );

      case 'not-available':
        return (
          <div className="update-status-current">
            <IoCheckmarkOutline />
            <span>You're using the latest version (v{currentVersion})</span>
          </div>
        );

      case 'downloading':
        return (
          <div className="update-status-downloading">
            <div className="download-info">
              <span>Downloading update...</span>
              {updateStatus.progress && (
                <span className="progress-text">{Math.round(updateStatus.progress.percent)}%</span>
              )}
            </div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar" 
                style={{ width: `${updateStatus.progress?.percent || 0}%` }}
              />
            </div>
            {updateStatus.progress && (
              <small className="download-speed">
                {((updateStatus.progress.bytesPerSecond / 1024 / 1024).toFixed(2))} MB/s
              </small>
            )}
          </div>
        );

      case 'downloaded':
        return (
          <div className="update-status-downloaded">
            <div className="downloaded-info">
              <IoCheckmarkOutline />
              <div>
                <h3>Update ready to install!</h3>
                <p>Version {updateStatus.info?.version} has been downloaded.</p>
              </div>
            </div>
            <button className="btn-install" onClick={handleInstall}>
              <IoCheckmarkOutline />
              Install & Restart
            </button>
          </div>
        );

      case 'error':
        return (
          <div className="update-status-error">
            <div className="error-info">
              <span>Update failed</span>
              <p>{updateStatus.error || 'Unknown error occurred'}</p>
            </div>
            <button className="btn-retry" onClick={handleCheckForUpdates}>
              <IoRefreshOutline />
              Retry
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="settings-updates">
      <div className="updates-header">
        <h2>Updates</h2>
        <div className="current-version">
          Current version: <strong>v{currentVersion}</strong>
        </div>
      </div>

      <div className="updates-content">
        {renderStatus()}
      </div>

      <div className="updates-actions">
        <button 
          className="btn-check-updates" 
          onClick={handleCheckForUpdates}
          disabled={updateStatus?.status === 'checking' || updateStatus?.status === 'downloading'}
        >
          <IoRefreshOutline className={updateStatus?.status === 'checking' ? 'spinning' : ''} />
          Check for Updates
        </button>
      </div>
    </div>
  );
}
