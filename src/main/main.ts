import path from 'path';
import { app, BrowserWindow, shell, ipcMain, session } from 'electron';
import { resolveHtmlPath } from './util';
import { createWindow as createSettingsWindow } from '../settings-main/settings-main';
import { createWindow as createControllerWindow } from '../controller-main/controller-main';
import { windowStore } from '../window_store';
import { ElectronBlocker } from '@ghostery/adblocker-electron';

let mainWindow: BrowserWindow | null = null;

ipcMain.on('open-settings-window', async () => {
  createSettingsWindow();
});

ipcMain.on('open-controller-window', async () => {
  createControllerWindow();
});

ipcMain.on('window-minimize', () => {
  mainWindow?.minimize();
});

ipcMain.on('window-close', () => {
  windowStore.closeAll();
});

ipcMain.on('start-search-on', () => {
  mainWindow?.webContents.send('start-search-receiver-on');
})

ipcMain.on('start-search-off', () => {
  mainWindow?.webContents.send('start-search-receiver-off');
})

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

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

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  let persistSession = session.fromPartition('persist:contentview');

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
    },
    fullscreenable: false,
    transparent: true,
    frame: false,
    
  });

  const blocker = await ElectronBlocker.fromLists(fetch, [
    'https://easylist.to/easylist/easylist.txt'
  ]);

  blocker.enableBlockingInSession(persistSession);

  mainWindow.setMenu(null);
  mainWindow.setAlwaysOnTop(true, 'screen-saver');

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }

    const checkControllerWindow = setInterval(() => {
      const controllerWindow: BrowserWindow | undefined = windowStore.get('controller-window');
      if (controllerWindow && mainWindow) {
        const { x, y, width, height } = mainWindow.getBounds();
        controllerWindow.setBounds({
          x: x - 30,
          y: y,
          width: 30,
          height,
        });
        controllerWindow.show();
        clearInterval(checkControllerWindow);
      }
    }, 100);

    mainWindow.on('move', () => {
      const controllerWindow: BrowserWindow | undefined = windowStore.get('controller-window');
      if (controllerWindow && mainWindow) {
        const { x, y, width, height } = mainWindow.getBounds();
        controllerWindow.setBounds({
          x: x - 30,
          y: y,
          width: 30,
          height,
        });
      }
    });

    mainWindow.on('minimize', () => {
      const controllerWindow: BrowserWindow | undefined = windowStore.get('controller-window');
      if (controllerWindow) {
        controllerWindow.hide();
      }
    })

    mainWindow.on('focus', () => {
      const controllerWindow: BrowserWindow | undefined = windowStore.get('controller-window');
      if (controllerWindow) {
        controllerWindow.show();
      }
    })

    console.log('Blocking ads enabled in persistent session.');
  });

  mainWindow.loadURL(resolveHtmlPath('main.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  windowStore.add('main-window', mainWindow);
  createControllerWindow();
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.commandLine.appendSwitch('url');

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
