import { mount } from '@cypress/react';
import React from 'react';

import Location from './Location';

const info = {
  entityLocation: 'Shirimatunda,Tanzania',
};

describe('Location', () => {
  it('Location', () => {
    mount(<Location {...info} />);
  });
});
