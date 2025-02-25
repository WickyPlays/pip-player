import './Screen.scss';
import { useAtom } from 'jotai';
import { isFocusAtom, linkAtom } from '../atoms';
import SearchScreen from './SearchScreen';
import ScreenYoutube from './media/ScreenYoutube';

export default function Screen() {
  const [link] = useAtom(linkAtom);
  const [isFocus, setIsFocus] = useAtom(isFocusAtom);

  return (
    <div className='screen'>
      <SearchScreen />
      <div className='video-container'>
        {isFocus ? <ScreenYoutube url={link} /> : (
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

