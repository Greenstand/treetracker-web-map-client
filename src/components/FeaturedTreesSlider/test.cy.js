import { mount } from '@cypress/react';
import React from 'react';

import FeaturedTreesSlider from './index';

describe('Featured Trees Slider', () => {
  it('it shows featured trees', () => {
    mount(<FeaturedTreesSlider />);
  });
});
