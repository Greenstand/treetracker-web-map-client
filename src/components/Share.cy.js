import Share from './Share';
import { mountWithTheme as mount } from '../models/test-utils';

describe('Share', () => {
  before(() => {});

  it('Share', () => {
    mount(<Share shareUrl="https://treetracker.org/?treeid=300556" />);
    cy.get('.MuiButtonBase-root').click();
    cy.get('#EmbedButton').click();
    cy.contains(/copy/i).click();
  });
});
