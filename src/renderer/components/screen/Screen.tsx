import './Screen.scss';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { isFocusAtom, linkAtom } from '../atoms';
import SearchScreen from './SearchScreen';
import { convertEmbedLink } from '../../utils/EmbedUtil';

export default function Screen() {
  const [link] = useAtom(linkAtom);
  const [isFocus, setIsFocus] = useAtom(isFocusAtom)

  useEffect(() => {
    console.log('Playing', link);
  }, [link]);

  return (
    <div className='screen'>
      <SearchScreen />
      <div className='video-container'>
        <webview id='video' src={isFocus ? convertEmbedLink(link) : link} partition='persist:contentview' allowFullScreen={false}></webview>
      </div>
    </div>
  );
}
