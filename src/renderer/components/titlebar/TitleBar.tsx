import './TitleBar.scss';
import { useEffect, useState } from 'react';
import MatButton from '../materials/MatButton';
import icon from '/assets/icons/icon.png';
import { CaretRightOutlined, YoutubeOutlined } from '@ant-design/icons';
import { convertEmbedLink } from '../../utils/EmbedUtil';
import { useAtom } from 'jotai';
import { linkAtom } from '../atoms';

export default function TitleBar() {
  const [embedToggle, setEmbedToggle] = useState<boolean>(false);
  const [link, setLink] = useAtom(linkAtom);

  const runLink = () => {
    setLink(convertEmbedLink(link, embedToggle));
  };

  const closeApp = async () => {
    window.electron.ipcRenderer.send('window-close', []);
  };

  const minimizeApp = async () => {
    window.electron.ipcRenderer.send('window-minimize', []);
  };

  useEffect(() => {
    runLink();
  }, [embedToggle]);

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
          value={link}
          onChange={(e) => setLink(e.target.value)}
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