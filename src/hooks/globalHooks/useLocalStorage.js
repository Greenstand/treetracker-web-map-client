import { useState, useEffect } from 'react';

// Get value from localStorage if possible, otherwise return provided default
function getStorageValue(key, defaultValue) {
  const value = localStorage.getItem(key);
  let saved;
  // log.warn('value:', value);
  if (value && value !== 'undefined') {
    saved = JSON.parse(value);
  }
  return saved || defaultValue;
}

// Usage: Similar to useState. Accepts a key, value pair. For example:
// const [mode, setMode] = useLocalStorage('theme', 'light');
const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(undefined);

  // Retrieve value from local storage on client side
  useEffect(() => {
    setValue(getStorageValue(key, defaultValue));
  }, []);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;
