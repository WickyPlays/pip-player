import { useState } from 'react'
import SettingsGeneral from './components/SettingsGeneral'
import SettingsMisc from './components/SettingsMisc'
import './SettingsApp.scss'
import SettingsExtension from './components/SettingsExtension'
import SettingsAbout from './components/SettingsAbout'

export default function SettingsApp() {

  const [currentIndex, setCurrentIndex] = useState(0)

  const settings = [
    {
      name: "General",
      component: <SettingsGeneral />
    },
    {
      name: "Extension",
      component: <SettingsExtension />
    },
    {
      name: "Miscellaneous",
      component: <SettingsMisc />
    },
    {
      name: "About",
      component: <SettingsAbout /> 
    }
  ]

  const handleTabClick = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className='settings-app'>
      <div className='tab'>
        {settings.map((setting, index) => (
          <div key={index} className={`tab-item ${currentIndex === index ? 'active' : ''}`} onClick={() => handleTabClick(index)}>
            {setting.name}
          </div>
        ))}
      </div>
      <div className='content'>
        {settings[currentIndex].component}
      </div>
    </div>
  )
}
