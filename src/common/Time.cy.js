import { mount } from '@cypress/react';
import React from 'react';

import Time from './Time';

const info = {
  entityName: 'November 7, 2020',
};

describe('Time', () => {
  it('Time', () => {
    mount(<Time {...info} />);
  });
});
