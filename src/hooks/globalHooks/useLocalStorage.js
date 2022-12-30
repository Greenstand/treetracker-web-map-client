import { useState, useEffect } from 'react';

const KEY_PREFIX = 'greenstand-web-map-client-';

// Get value from localStorage if possible, otherwise return provided default
export function getStorageValue(key, defaultValue) {
  if (typeof window !== 'undefined') {
    const value = localStorage.getItem(KEY_PREFIX + key);
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
    localStorage.setItem(KEY_PREFIX + key, JSON.stringify(value));
    window.dispatchEvent(new Event('storage'));
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;
