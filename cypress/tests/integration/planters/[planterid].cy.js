import planter from '../../../../doc/examples/planters/940.json';
import tree186734 from '../../../fixtures/tree186734.json';

const organization = {
  id: 1,
  name: '180Earth',
  area: 'Shirimatunda',
  country: 'Tanzania',
  created_at: 'November 11, 2019',
  about:
    'Greenway is a Youth-Driven Environmental Protection Organization providing alternative solutions to single-use plastic and planting carbon-sucking trees for socio-economic development and reducing climate crisis. Our social work includes reforestation, landscape restoration, climate education, awareness campaign, conducting research, outreach activities, and collaborating with key stakeholders to implement sustainable solutions.',
  mission:
    'To combat climate change, desertification, land degradation, carbon emission by inspiring healthier communities affected by severe climate disorder and modestly reducing pollution by 2050.',
};

beforeEach(() => {
  Cypress.env('nock') && cy.task('clearNock'); // This will clear any mocks that have been set
});

describe('Planter page', () => {
  it('getServerSideProps return mocks', () => {
    const path = `/planters/${planter.id}`;

    Cypress.env('nock') &&
      cy.task('nocks', {
        hostname: 'http://127.0.0.1:4010/mock',
        routes: [
          {
            method: 'GET',
            path: `/planters/${planter.id}`,
            statusCode: 200,
            body: {
              ...planter,
            },
          },
          {
            method: 'GET',
            path: '/trees/featured',
            statusCode: 200,
            body: {
              trees: [{ ...tree186734 }],
            },
          },
          {
            method: 'GET',
            path: `/species/query/planter_id=940`,
            statusCode: 200,
            body: {
              species: [
                {
                  ...tree186734,
                },
              ],
            },
          },
          {
            method: 'GET',
            path: `/organizations/query/planter_id=940`,
            statusCode: 200,
            body: [{ ...organization }],
          },
          {
            method: 'GET',
            path: `/trees/query/planter_id=940&limit=4`,
            statusCode: 200,
            body: {
              trees: [
                {
                  ...planter,
                },
              ],
            },
          },
        ],
      });

    cy.visit(path, {
      failOnStatusCode: false,
    });
    cy.contains(planter.id);
    cy.get('.MuiTypography-h2').contains(/sebastian g/i);
  });
});
