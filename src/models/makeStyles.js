import { createMakeAndWithStyles } from 'tss-react';
import theme from 'theme';

function useTheme() {
  return {
    ...theme,
  };
}

export const { makeStyles, withStyles } = createMakeAndWithStyles({
  useTheme,
});
