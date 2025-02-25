import { BrowserWindow } from 'electron';

class WindowStore {
  private static instance: WindowStore;
  private windows: Map<string, BrowserWindow> = new Map();

  private constructor() {}

  static getInstance(): WindowStore {
    if (!WindowStore.instance) {
      WindowStore.instance = new WindowStore();
    }
    return WindowStore.instance;
  }

  add(id: string, window: BrowserWindow): void {
    this.windows.set(id, window);
  }

  get(id: string): BrowserWindow | undefined | null {
    return this.windows.get(id);
  }

  delete(id: string): boolean {
    const window = this.windows.get(id);
    if (window) {
      this.windows.delete(id);
      return true;
    }
    return false;
  }

  getAll(): BrowserWindow[] {
    return Array.from(this.windows.values());
  }

  has(id: string): boolean {
    return this.windows.has(id);
  }

  clear(): void {
    this.windows.forEach((window) => {
      if (!window.isDestroyed()) {
        window.close();
      }
    });
    this.windows.clear();
  }

  
  closeAll(): void {
    this.windows.forEach((window) => {
      if (!window.isDestroyed()) {
        window.close();
      }
    })
    this.clear();
  }
}

export const windowStore = WindowStore.getInstance();
