import { IoWarning } from 'react-icons/io5'
import './ScreenEmpty.scss'

export default function ScreenEmpty() {
  return (
    <div className='screen-empty'>
      <IoWarning className='icon' />
      <p>No media</p>
      <p className='note'>Please use search function to continue</p>
    </div>
  )
}