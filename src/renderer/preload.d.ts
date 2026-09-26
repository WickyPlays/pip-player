import { ElectronHandler } from '../main/preload';

declare global {
  interface Window {
    electron: ElectronHandler & {
      getVersion: () => string;
      getAppVersion: () => Promise<string>;
    };
  }
}

export {};
