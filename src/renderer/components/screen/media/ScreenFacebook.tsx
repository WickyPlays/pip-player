import { useEffect } from "react";
import { convertEmbedLink } from "../../../utils/EmbedUtil";

export default function ScreenFacebook({url, autoplay}: {url: string, autoplay: boolean}) {

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
        allow="autoplay"
        style={{ width: '100%', height: '100%', border: 'none', margin: '0', padding: '0', }}
        title="Facebook"
      />
    </div>
  )
}
