import './Screen.scss';
import { useAtom } from 'jotai';
import { isFocusAtom, linkAtom } from '../atoms';
import SearchScreen from './SearchScreen';
import ScreenYoutube from './media/ScreenYoutube';
import ScreenDailymotion from './media/ScreenDailymotion';
import ScreenFacebook from './media/ScreenFacebook';
import ScreenEmpty from './media/ScreenEmpty';
import { getLinkType, LinkType } from '../../utils/EmbedUtil';
import { useEffect, useState } from 'react';
import ScreenTwitch from './media/ScreenTwitch';

export default function Screen() {
  const [link] = useAtom(linkAtom);
  const [isFocus] = useAtom(isFocusAtom);
  const [autoplayMedia, setAutoplayMedia] = useState(true);
  const [linkType, setLinkType] = useState<LinkType>(LinkType.OTHER);

  useEffect(() => {
    const linkType = getLinkType(link)
    setLinkType(linkType);
  }, [link])

  useEffect(() => {
    window.electron.ipcRenderer.invoke('config-get-autoplayMedia').then((value) => {
      setAutoplayMedia(value);
    });
  }, [])

  return (
    <div className='screen'>
      {!link && <ScreenEmpty />}
      <SearchScreen />
      <div className='video-container'>
        {isFocus ? (
          linkType === LinkType.YOUTUBE ? (
            <ScreenYoutube url={link} autoplay={autoplayMedia} />
          ) : linkType === LinkType.DAILYMOTION ? (
            <ScreenDailymotion url={link} autoplay={autoplayMedia} />
          ) : linkType === LinkType.FACEBOOK ? (
            <ScreenFacebook url={link} autoplay={autoplayMedia} />
          ) : linkType === LinkType.TWITCH ? (
            <ScreenTwitch url={link} autoplay={autoplayMedia} />
          )          
          : (
            <webview
              id='video'
              src={link}
              partition='persist:contentview'
              allowFullScreen={false}
            ></webview>
          )
        ) : (
          <webview
            id='video'
            src={link}
            partition='persist:contentview'
            allowFullScreen={false}
          ></webview>
        )}
      </div>
    </div>
  );
}
