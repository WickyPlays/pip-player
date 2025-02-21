import path from 'path';
import { app, BrowserWindow, shell } from 'electron';
import { resolveHtmlPath } from '../main/util';
import { windowStore } from '../window_store';

let controllerWindow: BrowserWindow | null = null;

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

export const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  controllerWindow = new BrowserWindow({
    show: false,
    width: 25,
    height: 280,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      webviewTag: false,
      devTools: false,
    },
    resizable: false,
    fullscreenable: false,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    titleBarStyle: 'hidden',
  });

  controllerWindow.loadURL(resolveHtmlPath('controller.html'));

  controllerWindow.on('ready-to-show', () => {
    if (!controllerWindow) {
      throw new Error('"controllerWindow" is not defined');
    }

    controllerWindow.show();
  });

  controllerWindow.on('closed', () => {
    controllerWindow = null;
  });

  controllerWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  windowStore.add('controller-window', controllerWindow);
};