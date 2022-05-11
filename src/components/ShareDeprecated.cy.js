import Share from './ShareDeprecated';
import { mountWithTheme as mount } from '../models/test-utils';

describe('Share', () => {
  before(() => {});

  it('Share', () => {
    mount(<Share />);
    cy.get('.MuiButtonBase-root').click();
    cy.get(
      'div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > button:nth-child(1)',
    ).click();
    cy.contains(/copy/i).click();
  });
});
