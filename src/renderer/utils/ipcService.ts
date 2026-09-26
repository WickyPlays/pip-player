export interface UpdateInfo {
  version: string;
  releaseNotes?: string;
  releaseDate?: string;
}

export interface UpdateStatus {
  status: 'checking' | 'available' | 'not-available' | 'error' | 'downloading' | 'downloaded';
  info?: UpdateInfo;
  error?: string;
  progress?: {
    percent: number;
    bytesPerSecond: number;
    transferred: number;
    total: number;
  };
}

export interface IPCChannels {
  // Search history
  'add-to-search-history': string;
  'get-search-history': string[];
  'clear-search-history': void;
  'remove-from-search-history': string;
  
  // Window control
  'window-minimize': void;
  'window-close': void;
  'window-position': 'left' | 'right';
  'window-load-url': string;
  
  // Updates
  'update-status': UpdateStatus;
  'check-for-updates': void;
  'download-update': void;
  'install-update': void;
  
  // Config
  'config-set-windowDefaultPosition': string;
  'config-set-autoplayMedia': boolean;
  'config-set-minimizedOnStart': boolean;
  'config-get-windowDefaultPosition': string;
  'config-get-autoplayMedia': boolean;
  'config-get-minimizedOnStart': boolean;
  
  // External links
  'open-link': string;
  'open-email': string;
}

class IPCService {
  private ipcRenderer: typeof window.electron.ipcRenderer;
  private electron: typeof window.electron;

  constructor() {
    if (!window.electron || !window.electron.ipcRenderer) {
      throw new Error('Electron IPC is not available');
    }
    this.ipcRenderer = window.electron.ipcRenderer;
    this.electron = window.electron;
  }

  // Send one-way message
  send<K extends keyof IPCChannels>(channel: K, ...args: any[]): void {
    this.ipcRenderer.send(channel, ...args);
  }

  // Send message and wait for response
  async invoke<K extends keyof IPCChannels>(channel: K, ...args: any[]): Promise<IPCChannels[K]> {
    return this.ipcRenderer.invoke(channel, ...args);
  }

  // Listen to channel events
  on<K extends keyof IPCChannels>(channel: K, callback: (...args: any[]) => void): void {
    this.ipcRenderer.on(channel, callback);
  }

  // Remove listener from channel
  removeListener<K extends keyof IPCChannels>(channel: K, callback: (...args: any[]) => void): void {
    this.ipcRenderer.removeListener(channel, callback);
  }

  addToSearchHistory(url: string): void {
    this.send('add-to-search-history', url);
  }

  async getSearchHistory(): Promise<string[]> {
    return this.invoke('get-search-history');
  }

  clearSearchHistory(): void {
    this.send('clear-search-history');
  }

  removeFromSearchHistory(url: string): void {
    this.send('remove-from-search-history', url);
  }

  minimizeWindow(): void {
    this.send('window-minimize');
  }

  closeWindow(): void {
    this.send('window-close');
  }

  onWindowPosition(callback: (position: 'left' | 'right') => void): void {
    this.on('window-position', callback);
  }

  onWindowLoadUrl(callback: (url: string) => void): void {
    this.on('window-load-url', callback);
  }

  removeWindowPositionListener(callback: (position: 'left' | 'right') => void): void {
    this.removeListener('window-position', callback);
  }

  removeWindowLoadUrlListener(callback: (url: string) => void): void {
    this.removeListener('window-load-url', callback);
  }

  onUpdateStatus(callback: (status: UpdateStatus) => void): void {
    this.on('update-status', (_event, status) => callback(status));
  }

  removeUpdateStatusListener(callback: (...args: any[]) => void): void {
    this.removeListener('update-status', callback);
  }

  checkForUpdates(): void {
    this.send('check-for-updates');
  }

  downloadUpdate(): void {
    this.send('download-update');
  }

  installUpdate(): void {
    this.send('install-update');
  }

  setWindowDefaultPosition(position: string): void {
    this.send('config-set-windowDefaultPosition', position);
  }

  setAutoplayMedia(value: boolean): void {
    this.send('config-set-autoplayMedia', value);
  }

  setMinimizedOnStart(value: boolean): void {
    this.send('config-set-minimizedOnStart', value);
  }

  async getWindowDefaultPosition(): Promise<string> {
    return this.invoke('config-get-windowDefaultPosition');
  }

  async getAutoplayMedia(): Promise<boolean> {
    return this.invoke('config-get-autoplayMedia');
  }

  async getMinimizedOnStart(): Promise<boolean> {
    return this.invoke('config-get-minimizedOnStart');
  }

  onWindowDefaultPosition(callback: (position: string) => void): void {
    this.on('config-get-windowDefaultPosition', callback);
  }

  onAutoplayMedia(callback: (value: boolean) => void): void {
    this.on('config-get-autoplayMedia', callback);
  }

  onMinimizedOnStart(callback: (value: boolean) => void): void {
    this.on('config-get-minimizedOnStart', callback);
  }

  removeWindowDefaultPositionListener(callback: (position: string) => void): void {
    this.removeListener('config-get-windowDefaultPosition', callback);
  }

  removeAutoplayMediaListener(callback: (value: boolean) => void): void {
    this.removeListener('config-get-autoplayMedia', callback);
  }

  removeMinimizedOnStartListener(callback: (value: boolean) => void): void {
    this.removeListener('config-get-minimizedOnStart', callback);
  }

  openLink(url: string): void {
    this.send('open-link', url);
  }

  openEmail(email: string): void {
    this.send('open-email', email);
  }

  openSettingsWindow(): void {
    this.electron.ipcRenderer.openSettingsWindow();
  }

  async getAppVersion(): Promise<string> {
    return this.electron.getAppVersion();
  }

  getVersion(): string {
    return this.electron.getVersion();
  }
}

export const ipcService = new IPCService();
export default ipcService;
