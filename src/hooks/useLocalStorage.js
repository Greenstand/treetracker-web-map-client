import log from 'loglevel';
import { useState, useEffect } from 'react';

// Get values from localstorage
function getStorageValue(key, defaultValue) {
  if (typeof window !== 'undefined') {
    const value = localStorage.getItem(key);
    let saved;
    // log.warn('value:', value);
    if (value && value !== 'undefined') {
      saved = JSON.parse(value);
    }
    return saved || defaultValue;
  }
  return defaultValue;
}

// Usage: Similar to useState. Accepts a key, value pair. For example:
// const [mode, setMode] = useLocalStorage('theme', 'light');
const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => getStorageValue(key, defaultValue));

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;
