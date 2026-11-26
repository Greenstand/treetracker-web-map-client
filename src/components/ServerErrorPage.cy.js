import { mountWithTheme as mount } from 'models/test-utils';
import ServerErrorPage from '../pages/500';

describe('500 page', () => {
  it('uses the theme typography', () => {
    mount(<ServerErrorPage />);

    cy.contains('h1', '500')
      .should('be.visible')
      .and(($heading) => {
        expect(getComputedStyle($heading[0]).fontFamily).to.contain(
          'Montserrat',
        );
      });

    cy.contains('h3', 'Something went wrong')
      .should('be.visible')
      .and(($heading) => {
        expect(getComputedStyle($heading[0]).fontFamily).to.contain(
          'Montserrat',
        );
      });
  });
});
