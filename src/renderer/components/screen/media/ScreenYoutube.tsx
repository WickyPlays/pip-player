import { useEffect } from "react";
import ReactPlayer from "react-player";

export default function ScreenYoutube({url, autoplay}: {url: string, autoplay: boolean}) {

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
      <ReactPlayer width='100%' height='100%' src={url} controls playing={autoplay} />
    </div>
  )
}
