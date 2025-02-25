import path from 'path';
import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { resolveHtmlPath } from '../main/util';
import { windowStore } from '../window_store';

let settingsWindow: BrowserWindow | null = null;

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

ipcMain.on('open-link', (event, arg) => {
  shell.openExternal(arg);
});

ipcMain.on('open-email', (event, arg) => {
  shell.openExternal(`mailto:${arg}`);
})

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

  settingsWindow = windowStore.get('settings-window')
  if (settingsWindow) {
    settingsWindow.show();
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    show: false,
    title: 'Settings',
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
        devTools: false
    },
  });

  settingsWindow.loadURL(resolveHtmlPath('settings.html'));
  settingsWindow.setMenu(null);

  settingsWindow.on('ready-to-show', () => {
    if (!settingsWindow) {
      throw new Error('"settingsWindow" is not defined');
    }

    settingsWindow.show();
  });

  settingsWindow.on('closed', () => {
    windowStore.delete('settings-window');
    settingsWindow = null;
  });

  // Open urls in the user's browser
  settingsWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  windowStore.add('settings-window', settingsWindow);
};