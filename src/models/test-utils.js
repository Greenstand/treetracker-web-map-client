// eslint-disable-next-line import/no-extraneous-dependencies
import { mount } from '@cypress/react';
import { ThemeProvider } from '@material-ui/core';
import * as React from 'react';

import appTheme from '../theme';

// eslint-disable-next-line import/prefer-default-export
export function mountWithTheme(element) {
  return mount(<ThemeProvider theme={appTheme}>{element}</ThemeProvider>);
}
