import './Content.scss'
import { useEffect, useState } from "react";

export default function Content({ link, status = "No media" }: { link?: string; status?: string }) {

  useEffect(() => {
    console.log("Playing", link)
  }, [link])

  return (
    <div className='content'>
      <div className='video-container'>
        {/* {
          (link !== undefined && link !== null && link.length != 0 && link.trim().length != 0) ? (
            <iframe id='video' src={link} title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; web-share;">
            </iframe>
          ) : (
            <div className='no-media'>
              <p>{status}</p>
            </div>
          )
        } */}
        <webview id='video' src={link} partition="persist:electron"></webview>
      </div>
    </div>
  )
}
