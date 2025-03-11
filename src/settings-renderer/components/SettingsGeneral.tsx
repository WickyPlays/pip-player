import { useEffect, useState } from 'react';
import './SettingsGeneral.scss';

export default function SettingsGeneral() {
  const [position, setPosition] = useState<string>('mid');
  const [autoplay, setAutoplay] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const positions = [
    'top-left', 'top', 'top-right',
    'mid-left', 'mid', 'mid-right',
    'bottom-left', 'bottom', 'bottom-right'
  ];

  const handleWindowDefaultPosition = (pos: string) => {
    if (!pos) return;
    setPosition(pos);
    console.log(pos)
    window.electron.ipcRenderer.send('config-set-windowDefaultPosition', pos);
  }

  const handleAutoplay = (value: boolean) => {
    setAutoplay(value);
    window.electron.ipcRenderer.send('config-set-autoplayMedia', value);
  };

  const handleWindowMinimized = (value: boolean) => {
    setMinimized(value);
    window.electron.ipcRenderer.send('config-set-minimizedOnStart', value);
  };

  window.electron.ipcRenderer.on('config-get-windowDefaultPosition', (pos: string) => setPosition(pos));
  window.electron.ipcRenderer.on('config-get-autoplayMedia', (value: boolean) => setAutoplay(value));
  window.electron.ipcRenderer.on('config-get-minimizedOnStart', (value: boolean) => setMinimized(value));

  return (
    <div className='settings-general'>
      <h1>General</h1>
      <div className='content'>

        {/* Position of Window */}
        <div className='setting-item settings-position'>
          <label>Window Default Position</label>
          <div className='grid'>
            {positions.map((pos, index) => (
              <div
                key={index}
                className={`grid-item ${pos === position ? 'active' : ''}`}
                onClick={() => handleWindowDefaultPosition(pos)}
              ></div>
            ))}
          </div>
        </div>

        {/* Autoplay Media */}
        <div className='setting-item'>
          <label>Autoplay Media</label>
          <label className="switch">
            <input type="checkbox" checked={autoplay} onChange={() => handleAutoplay(!autoplay)} />
            <span className="slider round"></span>
          </label>
        </div>

        {/* Minimized on Start */}
        <div className='setting-item'>
          <label>Minimized on Start</label>
          <label className="switch">
            <input type="checkbox" checked={minimized} onChange={() => handleWindowMinimized(!minimized)} />
            <span className="slider round"></span>
          </label>
        </div>

      </div>
    </div>
  );
}
