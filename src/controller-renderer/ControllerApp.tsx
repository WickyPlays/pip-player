import './ControllerApp.scss'
import icon from './assets/icon.png'
import ButtonSet from './components/ButtonSet'

export default function ControllerApp() {
	return (
		<div className='controller-app'>
			<img className='icon' src={icon} alt='Logo' />
			<ButtonSet />
		</div>
	)
}