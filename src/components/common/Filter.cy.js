import React from 'react';

import { mountWithTheme as mount } from '../../models/test-utils';
import Filter from './Filter';

describe('Filter', () => {
  it('Filter', () => {
    cy.viewport(700, 600);
    mount(<Filter />);
  });
});
