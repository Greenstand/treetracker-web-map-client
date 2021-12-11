import React from 'react';

import { mountWithTheme as mount } from '../models/test-utils';
import TreeSpeciesCard from './TreeSpeciesCard';

describe('TreeSpeciesCard', () => {
  it('renders', () => {
    mount(<TreeSpeciesCard />);
  });
});
