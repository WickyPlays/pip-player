import './Screen.scss';
import { useAtom } from 'jotai';
import { isFocusAtom, linkAtom, refreshKeyAtom, webviewLoadedAtom, webviewRefAtom } from '../atoms';
import SearchScreen from './SearchScreen';
import ScreenYoutube from './media/ScreenYoutube';
import ScreenDailymotion from './media/ScreenDailymotion';
import ScreenFacebook from './media/ScreenFacebook';
import ScreenEmpty from './media/ScreenEmpty';
import { getLinkType, LinkType } from '../../utils/EmbedUtil';
import { useEffect, useState, useRef } from 'react';
import ScreenTwitch from './media/ScreenTwitch';
import ipcService from '../../utils/ipcService';

type LinkTypeValue = typeof LinkType[keyof typeof LinkType];

export default function Screen() {
  const [link] = useAtom(linkAtom);
  const [isFocus] = useAtom(isFocusAtom);
  const [refreshKey] = useAtom(refreshKeyAtom);
  const [webviewLoaded, setWebviewLoaded] = useAtom(webviewLoadedAtom);
  const [webviewRef, setWebviewRef] = useAtom(webviewRefAtom);
  const [autoplayMedia, setAutoplayMedia] = useState(true);
  const [linkType, setLinkType] = useState<LinkTypeValue>(LinkType.OTHER);
  const localWebviewRef = useRef<Electron.WebviewTag>(null);

  useEffect(() => {
    const detectedLinkType = getLinkType(link)
    setLinkType(detectedLinkType);
    // Reset webview loaded state when link changes
    setWebviewLoaded(false);
  }, [link, setWebviewLoaded])

  useEffect(() => {
    ipcService.getAutoplayMedia().then((value) => {
      setAutoplayMedia(value);
    });
  }, [])

  useEffect(() => {
    const webview = localWebviewRef.current;
    if (webview) {
      const handleDidFinishLoad = () => {
        setWebviewLoaded(true);
        setWebviewRef(webview);
      };
      
      webview.addEventListener('did-finish-load', handleDidFinishLoad);
      
      return () => {
        webview.removeEventListener('did-finish-load', handleDidFinishLoad);
      };
    }
  }, [setWebviewLoaded, setWebviewRef]);

  return (
    <div className='screen'>
      {!link && <ScreenEmpty />}
      <SearchScreen />
      <div className='video-container'>
        {isFocus ? (
          linkType === LinkType.YOUTUBE ? (
            <ScreenYoutube key={refreshKey} url={link} autoplay={autoplayMedia} />
          ) : linkType === LinkType.DAILYMOTION ? (
            <ScreenDailymotion key={refreshKey} url={link} autoplay={autoplayMedia} />
          ) : linkType === LinkType.FACEBOOK ? (
            <ScreenFacebook key={refreshKey} url={link} autoplay={autoplayMedia} />
          ) : linkType === LinkType.TWITCH ? (
            <ScreenTwitch key={refreshKey} url={link} autoplay={autoplayMedia} />
          )
          : (
            <webview
              ref={localWebviewRef}
              id='video'
              src={link}
              partition='persist:contentview'
              allowFullScreen={false}
            ></webview>
          )
        ) : (
          <webview
            ref={localWebviewRef}
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
