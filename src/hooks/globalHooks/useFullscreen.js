import { useMediaQuery, useTheme } from '@mui/material';

// Determine if fullscreen based on theme breakpoints
const useFullscreen = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('md'));
};

export default useFullscreen;
