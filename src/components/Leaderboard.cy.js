import React from 'react';

import { mountWithTheme as mount } from '../models/test-utils';
import LeaderBoard from './LeaderBoard';

const countries = [
  { id: 6632386, name: 'Tanzania', planted: 100000 },
  { id: 6632375, name: 'Uganda', planted: 90000 },
  { id: 6632544, name: 'China', planted: 70000 },
  { id: 6632357, name: 'United States', planted: 60000 },
];
if (countries) {
  // hard code
  countries[0].flag =
    'https://upload.wikimedia.org/wikipedia/commons/3/38/Flag_of_Tanzania.svg';
  countries[1].flag =
    'https://upload.wikimedia.org/wikipedia/commons/4/4e/Flag_of_Uganda.svg';
  countries[2].flag =
    'https://upload.wikimedia.org/wikipedia/commons/f/fa/Flag_of_the_People%27s_Republic_of_China.svg';
  countries[3].flag =
    'https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg';
}

describe('Leaderboard', () => {
  it('We check if <LeaderBoard/> component renders', () => {
    mount(<LeaderBoard countries={countries} />);
  });
});
