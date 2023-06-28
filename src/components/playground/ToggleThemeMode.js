import {
  ListItem,
  ListItemText,
  Stack,
  Typography,
  Switch,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { usePlaygroundThemeType } from 'hooks/contextHooks';

function ToggleThemeMode() {
  const [themeType, setThemeType] = usePlaygroundThemeType();
  const [isDark, setIsDark] = useState(false);

  const handleClick = () => {
    setThemeType(isDark ? 'light' : 'dark');
  };

  useEffect(() => {
    setIsDark(themeType === 'dark');
  }, [themeType]);

  return (
    <ListItem
      sx={{
        justifyContent: 'space-between',
        position: 'sticky',
        top: '0',
        zIndex: '100',
        backgroundColor: 'white',
      }}
    >
      <ListItemText
        sx={{
          textTransform: 'capitalize',
        }}
      >
        currently editing theme type
      </ListItemText>
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
        }}
      >
        <Typography
          variant="body2"
          color={isDark ? 'textSecondary' : 'textPrimary'}
          sx={{
            textTransform: 'capitalize',
          }}
        >
          light
        </Typography>
        <Switch checked={isDark} onChange={handleClick} color="default" />
        <Typography
          variant="body2"
          color={!isDark ? 'textSecondary' : 'textPrimary'}
          sx={{
            textTransform: 'capitalize',
          }}
        >
          dark
        </Typography>
      </Stack>
    </ListItem>
  );
}

export default ToggleThemeMode;
