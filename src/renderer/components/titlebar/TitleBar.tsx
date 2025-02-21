import './TitleBar.scss';
import { useState } from 'react';
import MatButton from '../materials/MatButton';
import icon from '/assets/icons/icon.png';
import { CaretRightOutlined, YoutubeOutlined } from '@ant-design/icons';
import { convertEmbedLink } from '../../utils/EmbedUtil';
import { useAtom } from 'jotai';
import { linkAtom, embedToggleAtom } from '../atoms';

export default function TitleBar() {
  const [embedToggle, setEmbedToggle] = useAtom(embedToggleAtom);
  const [link, setLink] = useAtom(linkAtom);
  const [inputLink, setInputLink] = useState(link);
  
  const runLink = () => {
    setLink(convertEmbedLink(inputLink, embedToggle));
  };

  const closeApp = async () => {
    window.electron.ipcRenderer.send('window-close', []);
  };

  const minimizeApp = async () => {
    window.electron.ipcRenderer.send('window-minimize', []);
  };

  return (
    <div className="titlebar">
      <div className="search">
        <div className="icon">
          <img src={icon} alt="Icon" />
        </div>
        <input
          type="text"
          id="query-link"
          placeholder="https://youtube.com/*"
          value={inputLink}
          onChange={(e) => setInputLink(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && runLink()}
        />
        <MatButton className="btn-play" onClick={runLink}>
          <CaretRightOutlined />
        </MatButton>
      </div>
      <div className="title-dragger"></div>
      <div className="title-menu">
        <MatButton
          className={`btn-embed-toggle ${!embedToggle ? 'btn-embed-toggle-not-run' : ''}`}
          onClick={() => setEmbedToggle(!embedToggle)}
        >
          <YoutubeOutlined />
        </MatButton>
        <MatButton className="btn-minimize" onClick={minimizeApp}>-</MatButton>
        <MatButton className="btn-close" onClick={closeApp}>X</MatButton>
      </div>
    </div>
  );
}
