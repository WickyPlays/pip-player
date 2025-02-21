import { useState } from 'react';
import Button from '../../renderer/components/materials/MatButton';
import './ButtonSet.scss';
import { SearchOutlined } from '@ant-design/icons';

export default function ButtonSet() {
	const [isSearchOn, setIsSearchOn] = useState(false);

	function toggleSearch() {
		const newState = !isSearchOn;
		setIsSearchOn(newState);
		window.electron.ipcRenderer.send(newState ? 'start-search-on' : 'start-search-off');
	}

	return (
		<div className='button-set'>
			<Button
				className={`btn-search ${isSearchOn ? 'btn-on' : ''}`}
				onClick={toggleSearch}
			>
				<SearchOutlined />
			</Button>
		</div>
	);
}