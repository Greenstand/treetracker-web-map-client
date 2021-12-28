import React from 'react';

import { mountWithTheme as mount } from '../models/test-utils';
import Share from './Share';

describe('Share', () => {
  before(() => {});

  it('Share', () => {
    mount(<Share shareUrl="https://treetracker.org/?treeid=300556" />);
    cy.get('.MuiButtonBase-root').click();
    cy.get('button[name="Embed"]').click();
    cy.contains(/copy/i).click();
  });
});
