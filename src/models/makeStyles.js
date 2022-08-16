import { createMakeAndWithStyles } from 'tss-react';
import { useCustomThemeContext } from 'hooks/contextHooks';

function useTheme() {
  const { theme } = useCustomThemeContext();
  return {
    ...theme,
  };
}

export const { makeStyles, withStyles } = createMakeAndWithStyles({
  useTheme,
});
