import React from 'react';

import { mountWithThemeAndRouter as mount } from '../models/test-utils';
import Navbar from './Navbar';

beforeEach(() => {
  cy.intercept('/_next/**', {
    fixture: 'images/greenstand_logo_full.png',
  });
});

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
