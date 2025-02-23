import { useState } from 'react';
import Button from '../materials/MatButton';
import './ButtonSet.scss';
import { IoCloseOutline, IoEyeOutline, IoRemoveOutline, IoSearchCircleOutline, IoSearchOutline, IoSettingsOutline } from 'react-icons/io5';
import { useAtom } from 'jotai';
import { isFocusAtom, isSearchingAtom } from '../atoms';

export default function ButtonSet() {
	let [isSearching, setIsSearching] = useAtom(isSearchingAtom)
	let [isFocus, setIsFocus] = useAtom(isFocusAtom)

	function toggleFocus() {
		setIsFocus(!isFocus);
	}

	function toggleSearch() {
		setIsSearching(!isSearching);
	}

	function toggleSettings() {
		window.electron.ipcRenderer.openSettingsWindow();
	}

	return (
		<div className='button-set'>
			<div className='button-set-top'>
				<div className='logo'>
				</div>
				<Button
					className={`btn-search ${isSearching ? 'btn-on' : ''}`}
					onClick={toggleSearch}
				>
					<IoSearchOutline />
				</Button>
				<Button
					className='btn-settings'
					onClick={toggleSettings}
				>
					<IoSettingsOutline />
				</Button>
			</div>

			<div className='dragger' />

			<div className='button-set-bottom'>
				<Button
					className={`btn-focus ${isFocus ? 'btn-focus-active' : ''}`}
					onClick={() => toggleFocus()}
				>
					<IoEyeOutline />
				</Button>
				<Button
					className='btn-minimize'
					onClick={() => window.electron.ipcRenderer.send('window-minimize')}
				>
					<IoRemoveOutline />
				</Button>
				<Button
					className='btn-close'
					onClick={() => window.electron.ipcRenderer.send('window-close')}
				>
					<IoCloseOutline />
				</Button>
			</div>
		</div>
	);
}
