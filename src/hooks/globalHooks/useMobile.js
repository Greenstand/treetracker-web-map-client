import { useMediaQuery, useTheme } from '@mui/material';

// Determine if mobile based on theme breakpoints
const useMobile = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('sm'));
};

export default useMobile;
