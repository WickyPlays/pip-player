import path from 'path';
import { app, BrowserWindow, shell, ipcMain, session, screen, net, protocol, dialog } from 'electron';
import { resolveHtmlPath } from './util';
import { createWindow as createSettingsWindow } from '../settings-main/settings-main';
import { windowStore } from '../window_store';
import { ElectronBlocker } from '@ghostery/adblocker-electron';

let mainWindow: BrowserWindow | null = null;

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

const createWindow = async () => {
  if (isDebug) await installExtensions();

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => path.join(RESOURCES_PATH, ...paths);
  const persistSession = session.fromPartition('persist:contentview');

  mainWindow = new BrowserWindow({
    show: true,
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
    mainWindow.show();
    openUrlFromProtocol(process.argv[1].replace(/^pipplayer\:\/\//, ''));
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
  mainWindow?.webContents.send('window-load-url', decodeURIComponent(url));
}

const isUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
    openUrlFromProtocol(commandLine.pop()?.replace(/^pipplayer\:\/\//, ''));
  });

  app.whenReady().then(() => {
    let foundUrl: string = '';

    if (mainWindow === null) {
      createWindow();
    }
  }).catch(console.log);
}

//MacOS
app.on('open-url', (event, url) => {
  openUrlFromProtocol(url);  
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('open-settings-window', async () => createSettingsWindow());
ipcMain.on('window-minimize', () => {
  mainWindow?.minimize();
});
ipcMain.on('window-close', () => windowStore.closeAll());

app.commandLine.appendSwitch('url');