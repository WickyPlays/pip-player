import { useState } from 'react';
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
                onClick={() => setPosition(pos)}
              ></div>
            ))}
          </div>
        </div>

        {/* Autoplay Media */}
        <div className='setting-item'>
          <label>Autoplay Media</label>
          <label className="switch">
            <input type="checkbox" checked={autoplay} onChange={() => setAutoplay(!autoplay)} />
            <span className="slider round"></span>
          </label>
        </div>

        {/* Minimized on Start */}
        <div className='setting-item'>
          <label>Minimized on Start</label>
          <label className="switch">
            <input type="checkbox" checked={minimized} onChange={() => setMinimized(!minimized)} />
            <span className="slider round"></span>
          </label>
        </div>

      </div>
    </div>
  );
}
