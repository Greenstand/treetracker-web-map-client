import React from 'react';

import { mountWithTheme as mount } from '../models/test-utils';
import VerifiedBadge from './VerifiedBadge';

describe('Verified Badge', () => {
  it('enabled', () => {
    mount(<VerifiedBadge verified={true} badgeName="Tree Verified" />);
  });
  it('not enabled', () => {
    mount(<VerifiedBadge verified={false} badgeName="Tree Verified" />);
  });
});
