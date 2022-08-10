import { useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

// Return if embed=true parameter is present in URL
export function useEmbed() {
  const router = useRouter();
  const isEmbed = !!router.asPath.match(/embed=true/g);
  return isEmbed;
}

// Get value from localStorage if possible, otherwise return provided default
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
export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => getStorageValue(key, defaultValue));

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

// Determine if mobile based on theme breakpoints
export const useMobile = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('sm'));
};

// Determine if fullscreen based on theme breakpoints
export const useFullscreen = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('md'));
};
