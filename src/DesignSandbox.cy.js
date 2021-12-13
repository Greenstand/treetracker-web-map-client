import React from 'react';

import DesignSandbox from './DesignSandbox';
import { mountWithTheme as mount } from './models/test-utils';

describe('designSandbox', () => {
  it('it shows designSandbox', () => {
    cy.viewport(950, 750);
    mount(<DesignSandbox />);
  });
});
