import './Screen.scss';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { linkAtom } from '../atoms';
import TitleBar from '../titlebar/TitleBar';
import SearchScreen from './SearchScreen';

export default function Screen() {
  const [link] = useAtom(linkAtom);

  useEffect(() => {
    console.log('Playing', link);
  }, [link]);

  return (
    <div className='screen'>
      <TitleBar />
      <SearchScreen />
      <div className='video-container'>
        <webview id='video' src={link} partition='persist:contentview'></webview>
      </div>
    </div>
  );
}
