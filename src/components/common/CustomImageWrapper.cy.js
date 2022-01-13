import { formatDateString } from 'models/utils';
import CustomImageWrapper from './CustomImageWrapper';
import data from '../../../cypress/fixtures/tree186734.json';
import { mountWithTheme as mount } from '../../models/test-utils';

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

  it(
    'Image renders properly',
    {
      defaultCommandTimeout: 180000,
    },
    () => {
      cy.viewport(1440, 700);
      mount(
        <CustomImageWrapper
          imageUrl={data.image_url}
          timeCreated={data.time_created}
          likes={20}
        />,
      );
      cy.get('[alt="tree"]')
        .should('be.visible')
        .and(($img) => {
          expect($img[0].naturalWidth).to.be.greaterThan(0);
        });
    },
  );

  it('The date renders properly ', () => {
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
      .get('.MuiTypography-h6')
      .contains(formatDateString(data.time_created));
  });
});
