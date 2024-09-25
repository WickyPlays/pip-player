import './TitleBar.scss';
import { useEffect, useState } from 'react';
import Button from '../materials/Button';
import icon from '/assets/icons/icon.png';
import { CaretRightOutlined } from '@ant-design/icons';
import { YoutubeOutlined } from '@ant-design/icons';
import { convertEmbedLink } from '../../utils/EmbedUtil';

interface TitleBarProps {
  setLink: (link: string) => void;
}

export default function TitleBar({ setLink }: TitleBarProps) {
  const [linkVal, setLinkVal] = useState<string>('');
  const [embedToggle, setEmbedToggle] = useState<boolean>(false);

  const runLink = function() {
    setLink(convertEmbedLink(linkVal, embedToggle));
  }

  const closeApp = async () => {
    window.electron.ipcRenderer.sendMessage(
      'window-close' as 'ipc-example',
      [],
    );
  };

  const minimizeApp = async () => {
    window.electron.ipcRenderer.sendMessage(
      'window-minimize' as 'ipc-example',
      [],
    );
  };

  useEffect(() => {
    runLink()
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
          value={linkVal}
          onChange={(e) => setLinkVal(e.target.value)}
        />
        <Button className="btn-play" onClick={() => runLink()}>
          <CaretRightOutlined />
        </Button>
      </div>
      <div className="title-dragger"></div>
      <div className="title-menu">
        <Button className={`btn-embed-toggle ${!embedToggle ? 'btn-embed-toggle-not-run' : ''}`} onClick={() => {
          setEmbedToggle(!embedToggle)
        }}>
          <YoutubeOutlined />
        </Button>
        <Button className="btn-minimize" onClick={minimizeApp}>
          -
        </Button>
        <Button className="btn-close" onClick={closeApp}>
          X
        </Button>
      </div>
    </div>
  );
}
