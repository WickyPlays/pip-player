import { useEffect, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import './SettingsRecent.scss';
import ipcService from '../../renderer/utils/ipcService';

export default function SettingsRecent() {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = () => {
    ipcService.getSearchHistory().then((history: string[]) => {
      setSearchHistory(history || []);
    });
  };

  const handleClearHistory = () => {
    ipcService.clearSearchHistory();
    setSearchHistory([]);
  };

  const handleRemoveItem = (url: string) => {
    ipcService.removeFromSearchHistory(url);
    setSearchHistory(prev => prev.filter(item => item !== url));
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
                  <button 
                    className='btn-remove-item' 
                    onClick={() => handleRemoveItem(url)}
                    title='Remove from history'
                  >
                    <IoCloseOutline />
                  </button>
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
