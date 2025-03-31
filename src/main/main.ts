import path from 'path';
import { app, BrowserWindow, shell, ipcMain, session, screen, protocol, dialog } from 'electron';
import { resolveHtmlPath } from './util';
import { createWindow as createSettingsWindow } from '../settings-main/settings-main';
import { windowStore } from '../window_store';
import { ElectronBlocker } from '@ghostery/adblocker-electron';
import Store from 'electron-store';

let mainWindow: BrowserWindow | null = null;
let pendingUrl: string | null = null;

const schema = {
  windowDefaultPosition: {
    type: 'string',
    default: 'mid',
  },
  autoplayMedia: {
    type: 'boolean',
    default: false
  },
  minimizedOnStart: {
    type: 'boolean',
    default: false
  }
};

const store = new Store({ schema });

const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (process.env.NODE_ENV === 'production') {
  require('source-map-support').install();
}

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];
  return installer.default(
    extensions.map((name) => installer[name]),
    forceDownload
  ).catch(console.log);
};

const setWindowPosition = () => {
  const windowPosition = store.get('windowDefaultPosition');
  if (mainWindow) {
    switch (windowPosition) {
      case 'top-left':
        mainWindow.setPosition(0, 0);
        break;
      case 'top':
        mainWindow.setPosition((screen.getPrimaryDisplay().workAreaSize.width - mainWindow.getBounds().width) / 2, 0);
        break;
      case 'top-right':
        mainWindow.setPosition(screen.getPrimaryDisplay().workAreaSize.width - mainWindow.getBounds().width, 0);
        break;
      case 'mid-left':
        mainWindow.setPosition(0, (screen.getPrimaryDisplay().workAreaSize.height - mainWindow.getBounds().height) / 2);
        break;
      case 'mid':
        mainWindow.center();
        break;
      case 'mid-right':
        mainWindow.setPosition(screen.getPrimaryDisplay().workAreaSize.width - mainWindow.getBounds().width, (screen.getPrimaryDisplay().workAreaSize.height - mainWindow.getBounds().height) / 2);
        break;
      case 'bottom-left':
        mainWindow.setPosition(0, screen.getPrimaryDisplay().workAreaSize.height - mainWindow.getBounds().height);
        break;
      case 'bottom':
        mainWindow.setPosition((screen.getPrimaryDisplay().workAreaSize.width - mainWindow.getBounds().width) / 2, screen.getPrimaryDisplay().workAreaSize.height - mainWindow.getBounds().height);
        break;
      case 'bottom-right':
        mainWindow.setPosition(screen.getPrimaryDisplay().workAreaSize.width - mainWindow.getBounds().width, screen.getPrimaryDisplay().workAreaSize.height - mainWindow.getBounds().height);
        break;
      default:
        mainWindow.center();
        break;
    }
  }
};

const createWindow = async () => {
  if (isDebug) await installExtensions();

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => path.join(RESOURCES_PATH, ...paths);
  const persistSession = session.fromPartition('persist:contentview');

  mainWindow = new BrowserWindow({
    show: false,
    width: 480,
    height: 280,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      webviewTag: true,
      session: persistSession,
      devTools: true,
    },
    fullscreenable: false,
    transparent: true,
    frame: false,
  });

  const blocker = await ElectronBlocker.fromLists(fetch, ['https://easylist.to/easylist/easylist.txt']);
  blocker.enableBlockingInSession(persistSession);

  mainWindow.setMenu(null);
  mainWindow.setAlwaysOnTop(true, 'screen-saver');

  mainWindow.once('ready-to-show', () => {
    if (!mainWindow) throw new Error('"mainWindow" is not defined');
    setWindowPosition();
    const minimizedOnStart = store.get('minimizedOnStart');
    if (minimizedOnStart) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
    if (pendingUrl) {
      openUrlFromProtocol(pendingUrl);
      pendingUrl = null;
    }
  });

  mainWindow.loadURL(resolveHtmlPath('main.html'));
  mainWindow.on('closed', () => (mainWindow = null));
  mainWindow.on('moved', checkWindowPosition);
  mainWindow.on('resized', checkWindowPosition);

  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  windowStore.add('main-window', mainWindow);
};

const checkWindowPosition = () => {
  if (!mainWindow) return;
  const { width } = screen.getPrimaryDisplay().workAreaSize;
  const bounds = mainWindow.getBounds();
  if (bounds.x <= width * 0.35) {
    mainWindow.webContents.send('window-position', 'left');
  } else {
    mainWindow.webContents.send('window-position', 'right');
  }
};

const openUrlFromProtocol = (url?: string) => {
  if (!url || !isUrl(url)) return;
  if (mainWindow?.webContents) {
    mainWindow.webContents.send('window-load-url', decodeURIComponent(url));
  } else {
    pendingUrl = url;
  }
};

const isUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }

    const urlArg = commandLine.length > 1 ? commandLine.pop() : null;
    const extractedLink = urlArg?.replace(/^pipplayer:\/\//, '');
    const decodedLink = decodeURIComponent(extractedLink || '');
    
    if (decodedLink && isUrl(decodedLink)) {
      openUrlFromProtocol(decodedLink);
    }
  });

  app.whenReady().then(() => {
    if (mainWindow === null) {
      createWindow();
    }
  }).catch(console.log);
}

app.on('open-url', (event, url) => {
  if (url && isUrl(url)) {
    openUrlFromProtocol(url);
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('open-settings-window', async () => createSettingsWindow());
ipcMain.on('window-minimize', () => {
  mainWindow?.minimize();
});
ipcMain.on('window-close', () => windowStore.closeAll());
ipcMain.on('config-set-windowDefaultPosition', (event, pos: any) => {
  store.set('windowDefaultPosition', pos);
  setWindowPosition();
});

ipcMain.handle('config-get-autoplayMedia', () => {
  return store.get('autoplayMedia');
});

app.commandLine.appendSwitch('url');