import path from 'path';
import { app, BrowserWindow, shell, ipcMain, session, screen, net, protocol } from 'electron';
import { resolveHtmlPath } from './util';
import { createWindow as createSettingsWindow } from '../settings-main/settings-main';
import { windowStore } from '../window_store';
import { ElectronBlocker } from '@ghostery/adblocker-electron';
import url from 'url';

let mainWindow: BrowserWindow | null = null;

ipcMain.on('open-settings-window', async () => createSettingsWindow());

ipcMain.on('window-minimize', () => {
  mainWindow?.minimize();
});

ipcMain.on('window-close', () => windowStore.closeAll());

if (process.env.NODE_ENV === 'production') {
  require('source-map-support').install();
}

const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

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

const createWindow = async (loadUrl?: string) => {
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

    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }

    mainWindow.webContents.send('window-load-url', loadUrl);
  });

  mainWindow.loadURL(resolveHtmlPath('main.html'));

  mainWindow.on('closed', () => (mainWindow = null));

  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  mainWindow.on('moved', checkWindowPosition);
  mainWindow.on('resized', checkWindowPosition);

  windowStore.add('main-window', mainWindow);
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.commandLine.appendSwitch('url');

app.whenReady().then(() => {
  createWindow();
  let foundUrl: string

  protocol.handle('pipplayer', (request) => {
    const parsedUrl = decodeURIComponent(request.url.replace('pipplayer://', ''));
    foundUrl = parsedUrl
    return net.fetch(parsedUrl);
  });

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow(foundUrl);
    }
  });
}).catch(console.log);
