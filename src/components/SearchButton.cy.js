import React from 'react';

import { mountWithTheme as mount } from '../models/test-utils';
import SearchButton from './SearchButton';

describe('Search Button', () => {
  it('renders', () => {
    mount(<SearchButton />);
  });
});
