import { useState } from 'react';
import { IoLogoChrome, IoLogoEdge, IoLogoFirefox, IoWarning } from 'react-icons/io5';
import './SettingsExtension.scss';

export default function SettingsExtension() {
  const [hoveredBrowser, setHoveredBrowser] = useState(null);

  const browserNames = {
    chrome: 'Chrome (unavailable)',
    edge: 'Edge',
    firefox: 'Firefox (unavailable)'
  };

  const extensionLinks = {
    chrome: 'https://chrome.google.com/webstore/detail/your-extension-id',
    edge: 'https://microsoftedge.microsoft.com/addons/detail/pipplayer-loader/jkdibbdnahmnnghjfojfeocdahaoeaam',
    firefox: 'https://addons.mozilla.org/en-US/firefox/addon/your-extension-id'
  };

  const openLink = (link) => {
    window.electron.ipcRenderer.send('open-link', link);
  };

  return (
    <div className='settings-extension'>
      <h1>Extension</h1>
      <div className='content'>
        <p>
          Install extension on {hoveredBrowser ? <b>{hoveredBrowser}</b> : 'one of the following'}:
        </p>
        <div className='btn-set'>
          <button
            className='btn-install btn-install-disabled'
            onMouseEnter={() => setHoveredBrowser(browserNames.chrome)}
            onMouseLeave={() => setHoveredBrowser(null)}
          >
            <IoLogoChrome size={20} />
          </button>
          <button
            className='btn-install'
            onMouseEnter={() => setHoveredBrowser(browserNames.edge)}
            onMouseLeave={() => setHoveredBrowser(null)}
            onClick={() => openLink(extensionLinks.edge)}
          >
            <IoLogoEdge size={20} />
          </button>
          <button
            className='btn-install btn-install-disabled'
            onMouseEnter={() => setHoveredBrowser(browserNames.firefox)}
            onMouseLeave={() => setHoveredBrowser(null)}
          >
            <IoLogoFirefox size={20} />
          </button>
        </div>
        <div className='note'>
          <IoWarning className='icon' size={20} />
          <span>
            Due to restrictions made by the browser, the system cannot automatically install the extension for you, so you will have to do this by yourself.
          </span>
        </div>
      </div>
    </div>
  );
}
