import './Content.scss'
import { useEffect, useState } from "react";

export default function Content({ link, status = "No media" }: { link?: string; status?: string }) {

  useEffect(() => {
    console.log("Playing", link)
  }, [link])

  return (
    <div className='content'>
      <div className='video-container'>
        <webview id='video' src={link} partition="persist:contentview"></webview>
      </div>
    </div>
  )
}
