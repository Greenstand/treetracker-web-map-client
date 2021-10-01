import React from 'react';
import { mount } from '@cypress/react';
import VerifiedBadge from './VerifiedBadge';

describe('Verified Badge', () => {
  it('enabled', () => {
    mount(<VerifiedBadge verified={true} badgeName="Tree Verified" />);
  });
  it('not enabled', () => {
    mount(<VerifiedBadge verified={false} badgeName="Tree Verified" />);
  });
});
