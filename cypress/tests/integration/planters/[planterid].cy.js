import planter from '../../../../doc/examples/planters/940.json';

describe('Planter page', () => {
  it('getServerSideProps return mocks', () => {
    const path = `/planters/${planter.id}`;

    cy.visit(path, {
      failOnStatusCode: false,
    });
    cy.contains(planter.id);
    cy.get('.MuiTypography-h2').contains(/sebastian g/i);
  });
});
