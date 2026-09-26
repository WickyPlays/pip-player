import { useEffect, useState } from 'react';
import './SettingsRecent.scss';

export default function SettingsRecent() {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = () => {
    window.electron.ipcRenderer.invoke('get-search-history').then((history: string[]) => {
      setSearchHistory(history || []);
    });
  };

  const handleClearHistory = () => {
    window.electron.ipcRenderer.send('clear-search-history');
    setSearchHistory([]);
  };

  return (
    <div className='settings-recent'>
      <div className='settings-header'>
        <h1>Recent</h1>
      </div>
      <div className='content'>
        <div className='setting-item'>
          <label>Search History</label>
          {searchHistory.length === 0 ? (
            <p className='no-history'>No search history</p>
          ) : (
            <div className='history-list'>
              {searchHistory.map((url, index) => (
                <div key={index} className='history-item'>
                  <p className='history-url'>{url}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        {searchHistory.length > 0 && (
          <div className='setting-item'>
            <button className='btn-clear' onClick={handleClearHistory}>
              Clear all history
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
