import React from 'react';

import { mountWithTheme as mount } from '../models/test-utils';
import LeaderBoard from './LeaderBoard';


describe('LeaderBoard', () => {
  it('renders', () => {
    mount(<LeaderBoard />);
  });
});

