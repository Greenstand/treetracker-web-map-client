import DarkMode from '@mui/icons-material/DarkMode';
import LightMode from '@mui/icons-material/LightMode';
import IconButton from '@mui/material/IconButton';
import { useCustomThemeContext } from 'hooks/contextHooks';

export default function ChangeThemeButton() {
  const { colorMode, theme } = useCustomThemeContext();

  const alt =
    theme.palette.mode === 'light'
      ? 'Turn on dark mode (currently light mode)'
      : 'Turn on light mode (currently dark mode)';

  return (
    <IconButton
      aria-label={alt}
      onClick={colorMode.toggleColorMode}
      aria-live="polite"
    >
      {theme.palette.mode === 'light' ? <DarkMode /> : <LightMode />}
    </IconButton>
  );
}
