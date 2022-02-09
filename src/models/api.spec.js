import log from 'loglevel';
import {
  getCountryLeaderboard,
  getFeaturedTrees,
  getOrganizationById,
  getOrgLinks,
  getPlanterById,
  getTreeById,
} from './api';
import organization from '../../doc/examples/organizations/1.json';
import mockPlanter from '../../doc/examples/planters/940.json';

it('should get featured trees', async () => {
  const trees = await getFeaturedTrees();
  expect(trees).toBeDefined();
  expect(trees.map).toBeDefined();
});

it('should get country leaderboard', async () => {
  const countries = await getCountryLeaderboard();
  expect(countries).toBeDefined();
  expect(countries.map).toBeDefined();
});

describe('getOrganizationById', () => {
  it('should get organization with id', async () => {
    const id = 1;
    const org = await getOrganizationById(id);
    expect(org).toBeDefined();
    expect(org.mission).toBeDefined();
    expect(org.links).toBeDefined();
  });
});

describe('getPlanterById', () => {
  it('should get planter with id', async () => {
    const id = 1;
    const planter = await getPlanterById(id);
    expect(planter).toBeDefined();
    expect(planter.mission).toBeDefined();
    expect(planter.mission).toBeDefined();
  });
});

describe('getTreeById', () => {
  it('should get tree by id', async () => {
    const id = 1;
    const tree = await getTreeById(id);
    expect(tree).toBeDefined();
    expect(tree.name).toBeDefined();
  });
});

function assertLinks(data) {
  expect(data).toBeDefined();
  const {
    featuredTrees,
    associatedPlanters,
    species,
    associatedOrganizations,
  } = data;
  expect(featuredTrees).toBeDefined();
  expect(featuredTrees.trees).toBeDefined();
  expect(featuredTrees.trees.length).toBeDefined();
  expect(associatedPlanters || associatedOrganizations).toBeDefined();
  expect(species).toBeDefined();
}

describe('getOrgLinks', () => {
  it('should get org links', async () => {
    const data = await getOrgLinks(organization.links);
    assertLinks(data);
  });
  it('should get planter links', async () => {
    log.log(mockPlanter.links);
    const data = await getOrgLinks(mockPlanter.links);
    assertLinks(data);
  });
});
