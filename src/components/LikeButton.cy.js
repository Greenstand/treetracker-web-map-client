import React from 'react';

import { mountWithTheme as mount } from '../models/test-utils';
import LikeButton from './LikeButton';

describe('LikeButton', () => {
  it('LikeButton', () => {
    mount(<LikeButton />);
  });
});
