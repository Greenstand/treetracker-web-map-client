import { mount } from '@cypress/react';
import React from 'react';

import Time from './Time';

describe('Time', () => {
  it('Time', () => {
    const date = new Date(2020, 10, 11);
    mount(<Time date={date} />);
  });
});
