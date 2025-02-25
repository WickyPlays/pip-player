import { useEffect, useState } from 'react'
import './SearchScreen.scss'
import Button from '../materials/MatButton';
import { IoSearchOutline } from 'react-icons/io5'
import { isSearchingAtom, linkAtom } from '../atoms';
import { useAtom } from 'jotai';

export default function SearchScreen() {
  const [link, setLink] = useAtom(linkAtom);
  const [isSearching, setIsSearching] = useAtom(isSearchingAtom)
  const [inputLink, setInputLink] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputLink(event.target.value);
  };

  const handleSearch = () => {
    setLink(inputLink);
    setIsSearching(false)
  };

  window.electron.ipcRenderer.on('window-load-url', (url: any) => {
    setInputLink(url)
    setLink(url)
  })

  return (
    <div className='search-screen' style={{ display: isSearching ? 'flex' : 'none' }}>
      <p className='label'>Insert your URL link</p>
      <div className='search-container'>
        <input
          type="text"
          value={inputLink}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button className='btn-search' onClick={handleSearch}>
          <IoSearchOutline />
        </Button>
      </div>
    </div>
  );
}

