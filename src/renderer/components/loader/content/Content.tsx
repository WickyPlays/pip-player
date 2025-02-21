import './Content.scss';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { linkAtom } from '../../atoms';

export default function Content() {
  const [link] = useAtom(linkAtom);

  useEffect(() => {
    console.log('Playing', link);
  }, [link]);

  return (
    <div className='content'>
      <div className='video-container'>
        <webview id='video' src={link} partition='persist:contentview'></webview>
      </div>
    </div>
  );
}
