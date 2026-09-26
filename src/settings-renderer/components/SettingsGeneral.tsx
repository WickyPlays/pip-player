import { useEffect, useState } from 'react';
import './SettingsGeneral.scss';
import ipcService from '../../renderer/utils/ipcService';

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
    ipcService.setWindowDefaultPosition(pos);
  }

  const handleAutoplay = (value: boolean) => {
    setAutoplay(value);
    ipcService.setAutoplayMedia(value);
  };

  const handleWindowMinimized = (value: boolean) => {
    setMinimized(value);
    ipcService.setMinimizedOnStart(value);
  };

  useEffect(() => {
    const handlePosition = (pos: string) => setPosition(pos);
    const handleAutoplay = (value: boolean) => setAutoplay(value);
    const handleMinimized = (value: boolean) => setMinimized(value);

    ipcService.onWindowDefaultPosition(handlePosition);
    ipcService.onAutoplayMedia(handleAutoplay);
    ipcService.onMinimizedOnStart(handleMinimized);

    return () => {
      ipcService.removeWindowDefaultPositionListener(handlePosition);
      ipcService.removeAutoplayMediaListener(handleAutoplay);
      ipcService.removeMinimizedOnStartListener(handleMinimized);
    };
  }, []);

  return (
    <div className='settings-general'>
      <div className='settings-header'>
        <h1>General</h1>
      </div>
      <div className='content'>

        {/* Position of window */}
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

        {/* Autoplay media */}
        <div className='setting-item'>
          <label>Autoplay Media</label>
          <label className="switch">
            <input type="checkbox" checked={autoplay} onChange={() => handleAutoplay(!autoplay)} />
            <span className="slider round"></span>
          </label>
        </div>

        {/* Minimized on start */}
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
