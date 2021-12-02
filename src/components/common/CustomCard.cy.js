import React from 'react';

import { mountWithTheme as mount } from '../../models/test-utils';
import CustomCard from './CustomCard';

describe('mount Card', () => {
  it('CustomCard', () => {
    mount(<CustomCard />);
  });
});
