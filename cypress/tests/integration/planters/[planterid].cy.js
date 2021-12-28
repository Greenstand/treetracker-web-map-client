import data from '../../../../doc/examples/planters/940.json';

beforeEach(() => {
  Cypress.env('nock') && cy.task('clearNock'); // This will clear any mocks that have been set
});

describe('Loading the page planters/{planterId}', () => {
  it('getServerSideProps returns mock for the page planters/{planterId}', () => {
    const path = `/planters/${data.id}`;

    Cypress.env('nock') &&
      cy.task('nock', {
        hostname: 'http://127.0.0.1:4010/mock',
        method: 'GET',
        path,
        statusCode: 200,
        body: {
          ...data,
          status: 200,
        },
      });

    cy.visit(path);
    cy.contains(data.id);
  });

  it('should render planters/{planterId} page and display the name of the planter', () => {
    const path = `/planters/${data.id}`;

    cy.intercept(path, { doc: { example: '940.json' } });

    cy.request(`${path}/`);

    cy.get('.MuiTypography-h2').contains(/sebastian gaertner/i);
  });
});
