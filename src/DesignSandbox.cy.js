import React from 'react';

import { mountWithTheme as mount } from './models/test-utils';
import DesignSandbox from './DesignSandbox';

describe('designSandbox', () => {
  it('it shows designSandbox', () => {
    cy.viewport(867, 750);
    mount(<DesignSandbox />);
  });
});
