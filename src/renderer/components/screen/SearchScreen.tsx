import { useState } from 'react'
import './SearchScreen.scss'

export default function SearchScreen() {

  const [isSearching, setIsSearching] = useState(false);
  const [inputLink, setInputLink] = useState('');

  window.electron.ipcRenderer.on('start-search-receiver-on', () => {
    setIsSearching(true);
  })

  window.electron.ipcRenderer.on('start-search-receiver-off', () => {
    setIsSearching(false);
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputLink(event.target.value);
  }

  return (
    <div className='search-screen' style={{ display: isSearching ? 'flex' : 'none' }}>
      <p className='label'>Insert your URL link</p>
      <input type="text" value={inputLink} onChange={handleInputChange} />
    </div>
  )
}
