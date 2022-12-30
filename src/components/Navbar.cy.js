import Navbar from './Navbar';
import { mountWithThemeAndRouter as mount } from '../models/test-utils';

beforeEach(() => {
  cy.intercept('/_next/**', {
    fixture: 'images/greenstand_logo_full.png',
  });
});

describe('Navbar tests', () => {
  it('navbar-mobile', () => {
    mount(<Navbar />);
    cy.viewport(700, 900);
    cy.get('button[aria-controls="basic-menu"]')
      .click()
      .get('li')
      .contains('Treetracker');
    cy.get('li').contains('Blog');
  });
  it('navbar', () => {
    mount(<Navbar />);
    cy.viewport(1100, 900);
    cy.get('Button').contains('Blog');
  });
});
