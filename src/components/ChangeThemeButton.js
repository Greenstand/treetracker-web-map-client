import DarkMode from '@mui/icons-material/DarkMode';
import LightMode from '@mui/icons-material/LightMode';
import IconButton from '@mui/material/IconButton';
import { useCustomThemeContext } from '../context/themeContext';

export default function ChangeThemeButton() {
  const { colorMode, theme } = useCustomThemeContext();

  return (
    <IconButton aria-label="change theme" onClick={colorMode.toggleColorMode}>
      {theme.palette.mode === 'light' ? <DarkMode /> : <LightMode />}
    </IconButton>
  );
}
