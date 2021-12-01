import { mount } from '@cypress/react';
import React from 'react';

import Location from './Location';

describe('Location', () => {
  it('Location', () => {
    const coordinates = {
      latitude: 6.45407,
      longitude: 3.39467,
    };
    mount(<Location coordinates={coordinates} />);
  });
});
