import React from 'react';

import { mountWithTheme as mount } from '../models/test-utils';
import BackButton from './BackButton';

describe('BackButton', () => {
  it('renders', () => {
    mount(<BackButton />);
  });
});
