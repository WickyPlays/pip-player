import ReactPlayer from "react-player";

export default function ScreenYoutube({url, autoplay}: {url: string, autoplay: boolean}) {

  const styling = {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    boxSizing: 'border-box'
  }

  return (
    <div style={styling as any}>
      <ReactPlayer width='100%' height='100%' url={url} controls playsinline={autoplay} />
    </div>
  )
}
