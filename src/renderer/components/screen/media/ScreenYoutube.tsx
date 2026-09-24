import { useEffect } from "react";
import ReactPlayer from "react-player";

export default function ScreenYoutube({url, autoplay, key}: {url: string, autoplay: boolean, key?: number}) {

  const styling = {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    boxSizing: 'border-box'
  }

  useEffect(() => {
    console.log(url)
  }, [])

  return (
    <div style={styling as any}>
      <ReactPlayer key={key} width='100%' height='100%' src={url} controls playing={autoplay} />
    </div>
  )
}
