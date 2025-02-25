import { IoLogoGithub } from 'react-icons/io5'
import './SettingsAbout.scss'

export default function SettingsAbout() {

  function handleBtnSource() {
    window.electron.ipcRenderer.send("open-link", "https://github.com/WickyPlays/pip-player");
  }

  function handleBtnEmail() {
    window.electron.ipcRenderer.send("open-email", "baottworkspace@gmail.com");
  }

  return (
    <div className='settings-about'>
      <h1>About</h1>
      <div className='content'>
        <div className='meta'>
          <p>PIP-Player</p>
          <p>Version 1.2.0</p>
          <p>Author: Tu Thien Bao</p>
        </div>
        <div>
          <button>View licenses</button>
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