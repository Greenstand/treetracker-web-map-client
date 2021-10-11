import React from 'react';

import { mountWithTheme as mount } from '../models/test-utils';
import Navbar from './Navbar';

describe('Navbar tests', () => {
  it('navbar-mobile', () => {
    mount(<Navbar />);
    cy.viewport(700, 900);
    cy.get('Button').contains('Menu');
    cy.get('Button').contains('Menu').click().get('li').contains('Treetracker');
    cy.get('li').contains('Blog');
  });
  it('navbar', () => {
    mount(<Navbar />);
    cy.viewport(1100, 900);
    cy.get('Button').contains('Partnerships');
    cy.get('Button').contains('Contribute');
  });
});
