import theme from 'theme';
import { createMakeAndWithStyles } from 'tss-react';

function useTheme() {
  return {
    ...theme,
  };
}

export const { makeStyles, withStyles } = createMakeAndWithStyles({
  useTheme,
});
