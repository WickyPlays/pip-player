import { useEffect, useState, useRef } from 'react'
import './SearchScreen.scss'
import Button from '../materials/MatButton';
import { IoSearchOutline, IoChevronDownOutline } from 'react-icons/io5'
import { isSearchingAtom, linkAtom } from '../atoms';
import { useAtom } from 'jotai';

export default function SearchScreen() {
  const [link, setLink] = useAtom(linkAtom);
  const [isSearching, setIsSearching] = useAtom(isSearchingAtom)
  const [inputLink, setInputLink] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputLink(event.target.value);
  };

  const handleSearch = () => {
    if (inputLink.trim()) {
      setLink(inputLink);
      setIsSearching(false)
      setShowDropdown(false);
      window.electron.ipcRenderer.send('add-to-search-history', inputLink.trim());
    }
  };

  const handleHistoryItemClick = (url: string) => {
    setInputLink(url);
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    if (!showDropdown) {
      loadSearchHistory();
    }
    setShowDropdown(!showDropdown);
  };

  const loadSearchHistory = () => {
    window.electron.ipcRenderer.invoke('get-search-history').then((history: string[]) => {
      setSearchHistory(history || []);
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  window.electron.ipcRenderer.on('window-load-url', (url: any) => {
    setInputLink(url)
    setLink(url)
  })

  return (
    <div className='search-screen' style={{ display: isSearching ? 'flex' : 'none' }}>
      <p className='label'>Insert your URL link</p>
      <div className='search-container' ref={dropdownRef}>
        <Button className='btn-dropdown' onClick={toggleDropdown}>
          <IoChevronDownOutline />
        </Button>
        <input
          type="text"
          value={inputLink}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button className='btn-search' onClick={handleSearch}>
          <IoSearchOutline />
        </Button>
        {showDropdown && (
          <div className='history-dropdown'>
            {searchHistory.length === 0 ? (
              <p className='no-history'>No recent searches</p>
            ) : (
              searchHistory.slice(0, 10).map((url, index) => (
                <div
                  key={index}
                  className='history-item'
                  onClick={() => handleHistoryItemClick(url)}
                >
                  {url}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

