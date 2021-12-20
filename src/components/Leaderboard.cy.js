import React from 'react';

import { mountWithTheme as mount } from '../models/test-utils';
import LeaderBoard from './LeaderBoard';

describe('Leaderboard', () => {
  it('We check if <LeaderBoard/> component renders', () => {
    mount(<LeaderBoard />);
  });
});
