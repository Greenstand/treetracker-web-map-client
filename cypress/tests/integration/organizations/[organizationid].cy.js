import organization from '../../../../doc/examples/organizations/1.json';

describe('Organizations', () =>
  it(`organization test`, () => {
    const path = `/organizations/${organization.id}`;
    cy.visit(path, {
      failOnStatusCode: false,
    });
    cy.url().should('include', '/organizations');
    cy.contains(organization.name);
  }));
