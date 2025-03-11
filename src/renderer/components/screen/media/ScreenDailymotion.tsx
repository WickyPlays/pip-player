import { useEffect } from "react";
import { convertEmbedLink } from "../../../utils/EmbedUtil";

export default function ScreenDailymotion({url, autoplay}: {url: string, autoplay: boolean}) {

  const styling = {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    boxSizing: 'border-box'
  }

  useEffect(() => {
    console.log(url)
  }, [url])

  return (
    <div style={styling as any}>
      <iframe
        src={convertEmbedLink(url) + (autoplay ? '?autoplay=1' : '')}
        allowFullScreen
        allow="autoplay; fullscreen; picture-in-picture"
        style={{ width: '100%', height: '100%', border: 'none', margin: '0', padding: '0', }}
        title="Dailymotion"
      />
    </div>
  )
}
