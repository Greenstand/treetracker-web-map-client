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
      .then((val1) => {
        cy.get('input[type=text]')
          .eq(1)
          .invoke('val')
          .should((val2) => {
            const startDate_milliseconds = new Date(val1);
            const endDate_milliseconds = new Date(val2);
            const start = startDate_milliseconds.getTime();
            const end = endDate_milliseconds.getTime();

            expect(start).to.be.lessThan(end);
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
      .then((val1) => {
        cy.get('input[type=text]')
          .eq(1)
          .invoke('val')
          .should((val2) => {
            const startDate_milliseconds = new Date(val1);
            const endDate_milliseconds = new Date(val2);

            const start = startDate_milliseconds.getTime();
            const end = endDate_milliseconds.getTime();

            expect(start).to.be.greaterThan(end);
          });
        cy.contains(/submit/i)
          .click()
          .then(() => {
            expect(handleFilter).to.be.calledWith({
              startDate: '2020-01-05',
              endDate: '2020-01-02',
            });
          });
      });
  });

  it.only('Submit is Failed when StartDate is equal to endDate', () => {
    const handleFilter = cy.stub();

    mount(<Filter onFilter={handleFilter} />);
    cy.contains(/timeline/i);

    // cypress to find the date type of input, choose the first one, and input the date
    cy.get('input[type=text]').first().type('2020-01-05');

    // find the second date type of input, choose the second one, and input the date
    cy.get('input[type=text]').eq(1).type('2020-01-05');

    cy.get('input[type=text]')
      .invoke('val')
      .then((val1) => {
        cy.get('input[type=text]')
          .eq(1)
          .invoke('val')
          .should((val2) => {
            const startDate_milliseconds = new Date(val1);
            const endDate_milliseconds = new Date(val2);

            const start = startDate_milliseconds.getTime();
            const end = endDate_milliseconds.getTime();

            expect(start).equal(end);
          });
        cy.contains(/submit/i)
          .click()
          .then(() => {
            expect(handleFilter).to.be.calledWith({
              startDate: '2020-01-05',
              endDate: '2020-01-05',
            });
          });
      });
  });

  it.only('Cancel Button hides the filters', () => {
    const handleFilter = cy.stub();

    mount(<Filter onFilter={handleFilter} />);
    cy.contains(/timeline/i);

    cy.get('button').contains('Cancel').click();

    cy.get('[data-cy=hidden]').should('not.exist');
  });
});
