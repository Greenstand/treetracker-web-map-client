import Logo from './Logo';
import { mountWithTheme as mount } from '../models/test-utils';

describe('Logo', () => {
  it('it shows logo', () => {
    cy.intercept('/_next/**', {
      fixture: 'images/greenstand_logo_full.png',
    });

    mount(<Logo />);
    cy.get('a')
      .should('exist')
      .should('have.attr', 'href', 'https://greenstand.org/');
  });
});
