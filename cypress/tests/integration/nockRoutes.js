import organization1 from '../../../doc/examples/organizations/1.json';
import planter940 from '../../../doc/examples/planters/940.json';
import leader from '../../fixtures/countries/leader.json';
import tree186734 from '../../fixtures/tree186734.json';

export function getNockRoutes(
  props = {
    tree: {},
    organization: {},
    planter: {},
  },
) {
  const organization = { ...organization1, ...props.organization };
  const planter = { ...planter940, ...props.planter };
  const tree = { ...tree186734, ...props.tree };
  return [
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
      path: `/trees/${tree.id}`,
      statusCode: 200,
      body: tree,
    },

    {
      method: 'GET',
      path: `/planters/${planter.planter_id}`,
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
      path: planter.links.species,
      statusCode: 200,
      body: {
        species: [tree],
      },
    },
    {
      method: 'GET',
      path: planter.links.associated_organizations,
      statusCode: 200,
      body: { organizations: [organization] },
    },
    {
      method: 'GET',
      path: planter.links.featured_trees,
      statusCode: 200,
      body: {
        trees: [tree],
      },
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
  ];
}

export default getNockRoutes();
