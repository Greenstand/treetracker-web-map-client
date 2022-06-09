import { Button, Box } from '@mui/material';
import log from 'loglevel';
import React from 'react';
import { buildTheme } from '../../context/themeContext';
import useLocalStorage from '../../hooks/useLocalStorage';

function ThemeConfig() {
  const [theme, setTheme] = React.useState(
    JSON.stringify(buildTheme('light'), null, 2),
  );
  const [key, setKey] = React.useState(1);
  log.warn('theme to config:', theme);

  const [themeObject, setThemeObject] = useLocalStorage(
    'themeObject',
    undefined,
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setTheme(value);
  }

  function handleSave() {
    const themeObject2 = JSON.parse(theme);
    setThemeObject(themeObject2);
    setKey(key + 1);
  }

  return (
    <Box
      sx={{
        width: 1,
        display: 'flex',
      }}
    >
      <Box
        sx={{
          width: 0.8,
          height: '100vh',
        }}
      >
        <iframe
          title="sandbox"
          key={key}
          src="http://localhost:3000/"
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </Box>
      <Box>
        <Button onClick={handleSave} fullWidth>
          save
        </Button>
        <textarea
          onChange={handleChange}
          style={{
            width: '100%',
            height: '100%',
          }}
          value={theme}
         />
      </Box>
    </Box>
  );
}

export default ThemeConfig;
