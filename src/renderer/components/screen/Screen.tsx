import './Screen.scss';
import { useAtom } from 'jotai';
import { isFocusAtom, linkAtom } from '../atoms';
import SearchScreen from './SearchScreen';
import ScreenYoutube from './media/ScreenYoutube';
import { getLinkType, LinkType } from '../../utils/EmbedUtil';

export default function Screen() {
  const [link] = useAtom(linkAtom);
  const [isFocus] = useAtom(isFocusAtom);

  const linkType = getLinkType(link);
  const isYouTube = linkType === LinkType.YOUTUBE;

  return (
    <div className='screen'>
      <SearchScreen />
      <div className='video-container'>
        {isFocus && isYouTube ? (
          <ScreenYoutube url={link} />
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
