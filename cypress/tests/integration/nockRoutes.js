import grower100 from '../../../doc/examples/growers/100.json';
import organization1 from '../../../doc/examples/organizations/1.json';
import planter940 from '../../../doc/examples/planters/940.json';
import captures186734 from '../../../doc/examples/trees/186734captures.json';
import { defaultConfig } from '../../../src/context/configContext';
import capture1 from '../../fixtures/capture.json';
import leader from '../../fixtures/countries/leader.json';
import tree186734 from '../../fixtures/tree186734.json';

export function getNockRoutes(
  props = {
    tree: {},
    organization: {},
    grower: {},
    planter: {},
    capture: {},
    treeCaputres: {},
  },
) {
  const organization = { ...organization1, ...props.organization };
  const grower = { ...grower100, ...props.grower };
  const planter = { ...planter940, ...props.planter };
  const tree = { ...tree186734, ...props.tree };
  const capture = { ...capture1, ...props.capture };
  const treeCaputres = { ...captures186734, ...props.treeCaputres };

  return [
    {
      method: 'GET',
      path: `/growers/${grower.id}`,
      statusCode: 200,
      body: grower,
    },
    {
      method: 'GET',
      path: grower.links.species,
      statusCode: 200,
      body: {
        species: [tree],
      },
    },
    {
      method: 'GET',
      path: grower.links.associated_organizations,
      statusCode: 200,
      body: { organizations: [organization] },
    },
    {
      method: 'GET',
      path: grower.links.featured_trees,
      statusCode: 200,
      body: {
        trees: [tree],
      },
    },
    {
      method: 'GET',
      path: `/planters/${planter.id}`,
      statusCode: 200,
      body: planter,
    },
    {
      method: 'GET',
      path: '/trees/featured',
      statusCode: 200,
      body: {
        trees: [tree],
      },
    },
    {
      method: 'GET',
      path: `/trees/**`,
      statusCode: 200,
      body: tree,
    },
    {
      method: 'GET',
      path: `/trees/**/captures`,
      statusCode: 200,
      body: treeCaputres,
    },
    {
      method: 'GET',
      path: `/growers/${planter.id}`,
      statusCode: 200,
      body: planter,
    },
    {
      method: 'GET',
      path: `/organizations/${organization.id}`,
      statusCode: 200,
      body: organization,
    },
    {
      method: 'GET',
      path: organization.links.species,
      statusCode: 200,
      body: {
        species: [tree],
      },
    },
    {
      method: 'GET',
      path: organization.links.associated_planters,
      statusCode: 200,
      body: { planters: [planter] },
    },
    {
      method: 'GET',
      path: organization.links.featured_trees,
      statusCode: 200,
      body: {
        trees: [tree],
      },
    },
    {
      method: 'GET',
      path: '/countries/leaderboard',
      statusCode: 200,
      body: leader,
    },
    {
      method: 'GET',
      path: '/captures',
      statusCode: 200,
      body: {
        captures: [capture],
      },
    },
    {
      method: 'GET',
      path: `/stakeholder/${organization.id}`,
      statusCode: 200,
      body: organization,
    },
  ];
}

export function prepareNocks(props) {
  if (!Cypress.env('nock')) {
    console.warn("Cypress.env('nock') is not set, skipping nock preparation");
    return;
  }
  cy.task('nocks', {
    hostname: Cypress.env('NEXT_PUBLIC_API'),
    routes: getNockRoutes(props),
  });

  cy.task('nockIntercept', {
    hostname: 'https://dev-k8s.treetracker.org',
    method: 'get',
    path: '/map_config/config',
    statusCode: 200,
    body: {
      data: [
        {
          name: 'testing-config',
          data: defaultConfig,
        },
      ],
    },
  });
}

export function clearNocks() {
  Cypress.env('nock') && cy.task('clearNock');
}

export default getNockRoutes();
