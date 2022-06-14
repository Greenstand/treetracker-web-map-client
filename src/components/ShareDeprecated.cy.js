import Share from './ShareDeprecated';
import { mountWithTheme as mount } from '../models/test-utils';

describe('Share', () => {
  before(() => {});

  it('Share', () => {
    mount(<Share />);
    cy.get('.MuiButtonBase-root').click().pause();
    cy.get(
      '.MuiDialog-container > .MuiPaper-root > .MuiGrid-root > .MuiButtonBase-root:first',
    )
      .click()
      .pause();
    cy.contains(/copy/i).click();
  });
});
