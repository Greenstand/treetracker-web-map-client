import { Search } from './index';
import { mountWithTheme as mount } from '../../models/test-utils';

describe('search', () => {
  it('renders', () => {
    mount(<Search />);
  });

  it('exists ', () => {
    mount(<Search />);
    cy.get('.MuiFormControl-root').eq(0).type('a{enter}');
    cy.get('.MuiCard-root').eq(0).contains('asia');
  });

  it('does not exit ', () => {
    mount(<Search />);
    cy.get('.MuiFormControl-root').eq(0).type('ee{enter}');
    cy.get('.MuiCard-root').should('not.exist');
  });

  it('exits ', () => {
    mount(<Search />);
    cy.get('.MuiFormControl-root').eq(0).type('dadi');
    cy.get('.MuiCard-root').eq(0).contains('dadiorchen');
  });
});
