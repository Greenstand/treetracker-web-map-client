import React from 'react';

import { mountWithTheme as mount } from '../../models/test-utils';
import Filter from './Filter';
// import the expect function from Chai

describe('Filter', () => {
  it('Filter', () => {
    cy.viewport(700, 600);
    mount(<Filter />);
  });

  it.only('Submit is success when startDate is less than endDate', () => {
    const handleFilter = cy.stub();

    mount(<Filter onFilter={handleFilter} />);
    cy.contains(/timeline/i);

    // cypress to find the date type of input, choose the first one, and input the date
    cy.get('input[type=text]').first().type('2020-01-01');

    // find the second date type of input, choose the second one, and input the date
    cy.get('input[type=text]').eq(1).type('2020-01-02');

    cy.get('input[type=text]')
      .invoke('val')
      .then((startDate) => {
        cy.get('input[type=text]')
          .eq(1)
          .invoke('val')
          .should((endDate) => {
            const convertStartDate = new Date(startDate);
            const convert_endDate = new Date(endDate);

            const StartDate_milliSeconds = convertStartDate.getTime();
            const endDate_milliSeconds = convert_endDate.getTime();

            expect(StartDate_milliSeconds).to.be.lessThan(endDate_milliSeconds);
          });
      });
    cy.contains(/submit/i)
      .click()
      .then(() => {
        expect(handleFilter).to.be.calledWith({
          startDate: '2020-01-01',
          endDate: '2020-01-02',
        });
      });
  });

  it.only('Submit is Failed when startDate is greater than endDate', () => {
    const handleFilter = cy.stub();

    mount(<Filter onFilter={handleFilter} />);
    cy.contains(/timeline/i);

    // cypress to find the date type of input, choose the first one, and input the date
    cy.get('input[type=text]').first().type('2020-01-05');

    // find the second date type of input, choose the second one, and input the date
    cy.get('input[type=text]').eq(1).type('2020-01-02');

    cy.get('input[type=text]')
      .invoke('val')
      .then((startDate) => {
        cy.get('input[type=text]')
          .eq(1)
          .invoke('val')
          .should((endDate) => {
            const convertStartDate = new Date(startDate);
            const convert_endDate = new Date(endDate);

            const StartDate_milliSeconds = convertStartDate.getTime();
            const endDate_milliSeconds = convert_endDate.getTime();

            expect(StartDate_milliSeconds).to.be.greaterThan(
              endDate_milliSeconds,
            );
          });
      });
    cy.contains(/submit/i)
      .click()
      .then(() => {
        expect(handleFilter).to.been.not.calledWith({
          startDate: '2020-01-05',
          endDate: '2020-01-02',
        });
      });
  });

  it.only('Cancel Button hides the filters', () => {
    mount(<Filter />);
    cy.contains(/timeline/i);

    cy.get('button').contains('Cancel').click();

    cy.get('[data-cy=hidden]').should('not.exist');
  });
});
