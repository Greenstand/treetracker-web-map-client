import { mountWithTheme as mount } from 'models/test-utils';
import { formatDateString } from 'models/utils';
import CustomImageWrapper from './CustomImageWrapper';
import data from '../../../cypress/fixtures/tree186734.json';

describe('CustomImageWrapper', () => {
  it('The maximum icon link points to the right location', () => {
    cy.viewport(1440, 700);
    mount(
      <CustomImageWrapper
        imageUrl={data.image_url}
        timeCreated={data.time_created}
        likes={20}
      />,
    );
    cy.get('.tss-19g14hs-container')
      .trigger('mouseover')
      .get('a')
      .invoke('attr', 'href')
      .should('equal', `${data.image_url}`);
  });
});
