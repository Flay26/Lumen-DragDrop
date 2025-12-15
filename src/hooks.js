import { useEffect, useState } from 'react';

const STORAGE_KEY = 'lumen-dnd-layout';

export function useLocalLayout() {
  const [savedLayout, setSavedLayout] = useState(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setSavedLayout(JSON.parse(raw));
      }
    } catch {
      setSavedLayout(null);
    }
  }, []);

  const saveLayout = (layout) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
      setSavedLayout(layout);
      return true;
    } catch {
      return false;
    }
  };

  const clearLayout = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      setSavedLayout(null);
    } catch {
      // ignore
    }
  };

  return { savedLayout, saveLayout, clearLayout };
}


