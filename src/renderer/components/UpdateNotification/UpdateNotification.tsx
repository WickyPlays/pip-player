import { useState, useEffect } from 'react';
import { IoDownloadOutline, IoCheckmarkOutline, IoCloseOutline, IoRefreshOutline } from 'react-icons/io5';
import './UpdateNotification.scss';
import ipcService, { UpdateStatus } from '../../utils/ipcService';

export default function UpdateNotification() {
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleUpdateStatus = (...args: unknown[]) => {
      const status = args[1] as UpdateStatus;
      setUpdateStatus(status);
      
      // Show notification for important statuses
      if (status.status === 'available' || status.status === 'downloaded' || status.status === 'error') {
        setIsVisible(true);
      }
    };

    ipcService.on('update-status', handleUpdateStatus);

    return () => {
      ipcService.removeListener('update-status', handleUpdateStatus);
    };
  }, []);

  const handleDownload = () => {
    ipcService.downloadUpdate();
  };

  const handleInstall = () => {
    ipcService.installUpdate();
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const handleCheckForUpdates = () => {
    setUpdateStatus({ status: 'checking' });
    setIsVisible(true);
    ipcService.checkForUpdates();
  };

  if (!isVisible || !updateStatus) {
    return null;
  }

  const renderContent = () => {
    switch (updateStatus.status) {
      case 'checking':
        return (
          <div className="update-content">
            <div className="update-spinner">
              <IoRefreshOutline className="spinning" />
            </div>
            <span>Checking for updates...</span>
          </div>
        );

      case 'available':
        return (
          <div className="update-content">
            <div className="update-message">
              <span>Update available: v{updateStatus.info?.version}</span>
              {updateStatus.info?.releaseNotes && (
                <small>{updateStatus.info.releaseNotes}</small>
              )}
            </div>
            <div className="update-actions">
              <button className="btn-download" onClick={handleDownload}>
                <IoDownloadOutline />
                Download
              </button>
              <button className="btn-dismiss" onClick={handleDismiss}>
                <IoCloseOutline />
              </button>
            </div>
          </div>
        );

      case 'downloading':
        return (
          <div className="update-content">
            <div className="update-message">
              <span>Downloading update...</span>
              {updateStatus.progress && (
                <small>{Math.round(updateStatus.progress.percent)}%</small>
              )}
            </div>
            <div className="update-progress">
              <div 
                className="progress-bar" 
                style={{ width: `${updateStatus.progress?.percent || 0}%` }}
              />
            </div>
          </div>
        );

      case 'downloaded':
        return (
          <div className="update-content">
            <div className="update-message">
              <span>Update ready to install!</span>
              <small>Restart to apply update v{updateStatus.info?.version}</small>
            </div>
            <div className="update-actions">
              <button className="btn-install" onClick={handleInstall}>
                <IoCheckmarkOutline />
                Install & Restart
              </button>
              <button className="btn-dismiss" onClick={handleDismiss}>
                <IoCloseOutline />
              </button>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="update-content">
            <div className="update-message error">
              <span>Update failed</span>
              <small>{updateStatus.error || 'Unknown error'}</small>
            </div>
            <div className="update-actions">
              <button className="btn-retry" onClick={handleCheckForUpdates}>
                <IoRefreshOutline />
                Retry
              </button>
              <button className="btn-dismiss" onClick={handleDismiss}>
                <IoCloseOutline />
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="update-notification">
      {renderContent()}
    </div>
  );
}
