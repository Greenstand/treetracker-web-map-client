import Filter from './Filter';
import { mountWithTheme as mount } from '../../models/test-utils';

describe('Filter', () => {
  it('Filter', () => {
    cy.viewport(700, 600);
    mount(<Filter />);
  });

  it('Submit is success when startDate is less than endDate', () => {
    const handleFilter = cy.stub();

    mount(<Filter onFilter={handleFilter} />);
    cy.contains(/Filters/i).click();

    cy.contains('label', 'Start Date')
      .parent()
      .find('input')
      .type('01-01-2020');

    cy.contains('label', 'End Date').parent().find('input').type('01-02-2020');

    cy.contains(/submit/i)
      .click()
      .then(() => {
        expect(handleFilter).to.be.calledWith({
          startDate: '2020-01-01',
          endDate: '2020-02-01',
        });
      });
  });

  it('Submit is Failed when startDate is greater than endDate', () => {
    const handleFilter = cy.stub();

    mount(<Filter onFilter={handleFilter} />);
    cy.contains(/Filters/i).click();
    cy.contains('label', 'Start Date')
      .parent()
      .find('input')
      .type('01-05-2020');

    cy.contains('label', 'End Date').parent().find('input').type('01-02-2020');

    cy.contains(/submit/i)
      .click()
      .then(() => {
        expect(handleFilter).to.have.callCount(0);
      });
  });

  it('Cancel Button hides the filters', () => {
    mount(<Filter />);
    cy.contains(/Filters/i).click();

    cy.get('button').contains('Cancel').click();

    cy.get('[data-cy=hidden]').should('not.exist');
  });
});
