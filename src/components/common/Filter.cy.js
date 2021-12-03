import React from 'react';

import { mountWithTheme as mount } from '../../models/test-utils';
import Filter from './Filter';
// import the expect function from Chai

describe('Filter', () => {
  it('Filter', () => {
    cy.viewport(700, 600);
    mount(<Filter />);
  });

  it.only('Timeline feature', () => {
    const handleFilter = cy.stub();

    mount(<Filter onFilter={handleFilter} />);
    cy.contains(/timeline/i);

    // cypress to find the date type of input, choose the first one, and input the date
    cy.get('input[type=date]').first().type('2020-01-01');

    // find the second date type of input, choose the second one, and input the date
    cy.get('input[type=date]').eq(1).type('2020-01-02');

    // click submit button
    cy.contains(/submit/i)
      .click()
      .then(() => {
        expect(handleFilter).to.be.calledWith({
          startDate: '2020-01-01',
          endDate: '2020-01-02',
        });
      });
  });
});
