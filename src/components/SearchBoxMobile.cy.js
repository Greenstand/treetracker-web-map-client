import { mount } from '@cypress/react';
import React from 'react';

import SearchBox from './SearchBoxMobile';

describe('SearchBox', () => {
  it('searchBox', () => {
    mount(<SearchBox />);
  });
});
