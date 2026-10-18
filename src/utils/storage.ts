/**
 * Safe wrapper around localStorage that prevents runtime exceptions
 * in restricted environments (incognito/private browsing, iframes, Netlify previews, etc.)
 */
export const safeStorage = {
  getItem: (key: string, defaultValue: string | null = null): string | null => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const val = window.localStorage.getItem(key);
        return val !== null ? val : defaultValue;
      }
    } catch (e) {
      console.warn(`[DesplugaTEA safeStorage] Falha ao ler ${key}:`, e);
    }
    return defaultValue;
  },

  setItem: (key: string, value: string): boolean => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, value);
        return true;
      }
    } catch (e) {
      console.warn(`[DesplugaTEA safeStorage] Falha ao gravar ${key}:`, e);
    }
    return false;
  },

  removeItem: (key: string): void => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn(`[DesplugaTEA safeStorage] Falha ao remover ${key}:`, e);
    }
  },

  clear: (): void => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.clear();
      }
    } catch (e) {
      console.warn(`[DesplugaTEA safeStorage] Falha ao limpar storage:`, e);
    }
  }
};
