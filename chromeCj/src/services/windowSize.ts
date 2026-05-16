interface WindowSize {
  width: number;
  height: number;
}

class WindowSizeService {
  private readonly STORAGE_KEY = 'daily_planner_window_size';
  private readonly DEFAULT_SIZE: WindowSize = {
    width: 400,
    height: 600,
  };

  async getSavedSize(): Promise<WindowSize> {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get([this.STORAGE_KEY], (result) => {
          const saved = result[this.STORAGE_KEY];
          resolve(saved || this.DEFAULT_SIZE);
        });
      } else {
        // Fallback for development
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            resolve(parsed);
          } catch {
            resolve(this.DEFAULT_SIZE);
          }
        } else {
          resolve(this.DEFAULT_SIZE);
        }
      }
    });
  }

  async saveSize(size: WindowSize): Promise<void> {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({ [this.STORAGE_KEY]: size }, () => {
          resolve();
        });
      } else {
        // Fallback for development
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(size));
        resolve();
      }
    });
  }

  getMinSize(): WindowSize {
    return {
      width: 320,
      height: 400,
    };
  }

  getMaxSize(): WindowSize {
    return {
      width: 800,
      height: 1200,
    };
  }
}

export const windowSizeService = new WindowSizeService();
