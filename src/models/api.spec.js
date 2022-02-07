import {
  getCountryLeaderboard,
  getFeaturedTrees,
  getOrganizationById,
  getOrgLinks,
  getPlanterById,
} from './api';
import organization from '../../doc/examples/organizations/1.json';

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
  });
});

describe('getPlanterById', () => {
  it('should get planter with id', async () => {
    const id = 1;
    const planter = await getPlanterById(id);
    expect(planter).toBeDefined();
    expect(planter.mission).toBeDefined();
  });
});

describe('getOrgLinks', () => {
  it('should get links', async () => {
    const data = await getOrgLinks(organization);
    const { featuredTrees, associatedPlanters, species } = data;
    expect(data).toBeDefined();
    expect(featuredTrees).toBeDefined();
    expect(associatedPlanters).toBeDefined();
    expect(species).toBeDefined();
  });
});
