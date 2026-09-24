import Button from '../materials/MatButton';
import './ButtonSet.scss';
import { IoCloseOutline, IoEyeOutline, IoRemoveOutline, IoRefreshOutline, IoSearchCircleOutline, IoSearchOutline, IoSettingsOutline } from 'react-icons/io5';
import { useAtom } from 'jotai';
import { isFocusAtom, isSearchingAtom, refreshKeyAtom, linkAtom, webviewLoadedAtom, webviewRefAtom } from '../atoms';
import { getLinkType, LinkType } from '../../utils/EmbedUtil';

export default function ButtonSet() {
	let [isSearching, setIsSearching] = useAtom(isSearchingAtom)
	let [isFocus, setIsFocus] = useAtom(isFocusAtom)
	let [refreshKey, setRefreshKey] = useAtom(refreshKeyAtom)
	let [link] = useAtom(linkAtom)
	let [webviewLoaded] = useAtom(webviewLoadedAtom)
	let [webviewRef] = useAtom(webviewRefAtom)

	function toggleFocus() {
		setIsFocus(!isFocus);
	}

	function toggleSearch() {
		setIsSearching(!isSearching);
	}

	function toggleSettings() {
		window.electron.ipcRenderer.send('window-minimize');
		window.electron.ipcRenderer.openSettingsWindow();
	}

	function refreshContent() {
		const linkType = getLinkType(link);
		
		// If it's a ReactPlayer component and we're in focus mode, refresh by changing the key
		if (isFocus && (linkType === LinkType.YOUTUBE || linkType === LinkType.DAILYMOTION || 
		    linkType === LinkType.FACEBOOK || linkType === LinkType.TWITCH)) {
			setRefreshKey(prev => prev + 1);
		} else {
			// Otherwise, reload the webview only if it's loaded
			if (webviewLoaded && webviewRef) {
				webviewRef.reload();
			}
		}
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
					className='btn-refresh'
					onClick={refreshContent}
				>
					<IoRefreshOutline />
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
