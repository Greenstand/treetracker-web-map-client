import { createMakeAndWithStyles } from 'tss-react';
import { useCustomThemeContext } from 'context/themeContext';

function useTheme() {
  const { theme } = useCustomThemeContext();
  return {
    ...theme,
  };
}

export const { makeStyles, withStyles } = createMakeAndWithStyles({
  useTheme,
});
