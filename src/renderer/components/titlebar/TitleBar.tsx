import './TitleBar.scss';
import { useEffect, useState } from 'react';
import Button from '../materials/Button';
import icon from '/assets/icons/icon.png';

interface TitleBarProps {
  setLink: (link: string) => void;
}

export default function TitleBar({ setLink }: TitleBarProps) {
  const [linkVal, setLinkVal] = useState<string>('');

  const closeApp = async () => {
    window.electron.ipcRenderer.sendMessage('window-close' as 'ipc-example', []);
  };

  const minimizeApp = async () => {
    window.electron.ipcRenderer.sendMessage('window-minimize' as 'ipc-example', []);
  };

  useEffect(() => {
    // Add any effect logic here if needed
  }, []);

  return (
    <div className="titlebar">
      <div className="search">
        <div className='icon'>
          <img src={icon} alt='Icon' />
        </div>
        <input
          type='text'
          id='query-link'
          placeholder="https://youtube.com/*"
          value={linkVal}
          onChange={(e) => setLinkVal(e.target.value)}
        />
        <Button className='btn-play' onClick={() => setLink(linkVal)}>Play</Button>
      </div>
      <div className="title-dragger"></div>
      <div className='title-menu'>
        <Button className="btn-minimize" onClick={minimizeApp}>-</Button>
        <Button className="btn-close" onClick={closeApp}>X</Button>
      </div>
    </div>
  );
}
