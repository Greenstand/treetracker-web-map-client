import React from 'react';

import { mountWithTheme as mount } from '../../models/test-utils';
import Location from './Location';

const info = {
  entityLocation: 'Shirimatunda,Tanzania',
};

describe('Location', () => {
  it('Location', () => {
    mount(<Location {...info} />);
  });
});
