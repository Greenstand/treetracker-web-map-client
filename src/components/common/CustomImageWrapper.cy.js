import { mountWithTheme as mount } from '../../models/test-utils';
import React from 'react';
import data from '../../../cypress/fixtures/tree186734.json';

import TreeImage from './CustomImageWrapper';

describe('TreeImage', () => {
  it('The maximum icon link points to the right location', () => {
    cy.viewport(1440, 700);
    mount(
      <TreeImage
        imageUrl={data.image_url}
        timeCreated={data.time_created}
        likes={20}
      />,
    );
    cy.get('.tss-rvai9x-container')
      .trigger('mouseover')
      .get('a')
      .invoke('attr', 'href')
      .should('equal', `${data.image_url}`);
  });

  it('Image renders properly', () => {
    cy.viewport(1440, 700);
    mount(
      <TreeImage
        imageUrl={data.image_url}
        timeCreated={data.time_created}
        likes={20}
      />,
    );
    cy.get('[alt="tree image"]')
      .should('be.visible')
      .and(($img) => {
        expect($img[0].naturalWidth).to.be.greaterThan(0);
      });
  });

  it('The date renders properly ', () => {
    cy.viewport(1440, 700);
    mount(
      <TreeImage
        imageUrl={data.image_url}
        timeCreated={data.time_created}
        likes={20}
      />,
    );

    cy.get('.tss-rvai9x-container')
      .trigger('mouseover')
      .get('.MuiTypography-h6')
      .contains('1/9/2020');
  });
});
