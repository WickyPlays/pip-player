import { IoLogoGithub } from 'react-icons/io5'
import { useState, useEffect } from 'react'
import './SettingsAbout.scss'
import ipcService from '../../renderer/utils/ipcService'

export default function SettingsAbout() {
  const [version, setVersion] = useState('Loading...')

  useEffect(() => {
    setVersion(ipcService.getVersion())
  }, [])

  function handleBtnSource() {
    ipcService.openLink("https://github.com/WickyPlays/pip-player");
  }

  function handleBtnEmail() {
    ipcService.openEmail("baottworkspace@gmail.com");
  }

  function handleLicense() {
    ipcService.openLink("https://github.com/WickyPlays/pip-player/blob/main/LICENSE")
  }

  return (
    <div className='settings-about'>
      <div className='settings-header'>
        <h1>About</h1>
      </div>
      <div className='content'>
        <div className='meta'>
          <p>PIP-Player</p>
          <p>Version {version}</p>
          <p>Author: Tu Thien Bao (WickyPlays)</p>
        </div>
        <div>
          <button onClick={handleLicense}>View licenses</button>
        </div>
        <div className='contact'>
          <p>Any questions?</p>
          <p>Contact me at <span onClick={handleBtnEmail}>baottworkspace@gmail.com</span></p>
        </div>
        <div className='source'>
          <p className='title'>Source code</p>
          <div className='btn-source' onClick={handleBtnSource}>
            <IoLogoGithub size={20} />
            <p>View on Github</p>
          </div>
        </div>
      </div>
    </div>
  )
}