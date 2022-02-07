import {
  getCountryLeaderboard,
  getFeaturedTrees,
  getOrganizationById,
  getOrgPlanters,
  getOrgSpecies,
  getOrgTrees,
  getPlanterById,
} from './api';

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

describe('getOrgTrees', () => {
  it('should get trees', async () => {
    const id = 1;
    const { trees } = await getOrgTrees(id);
    expect(trees).toBeDefined();
    expect(trees.map).toBeDefined();
  });
});

describe('getOrgPlanters', () => {
  it('should get trees', async () => {
    const id = 1;
    const { planters } = await getOrgPlanters(id);
    expect(planters).toBeDefined();
    expect(planters.map).toBeDefined();
  });
});

describe('getOrgSpecies', () => {
  it('should get trees', async () => {
    const id = 1;
    const { species } = await getOrgSpecies(id);
    expect(species).toBeDefined();
    expect(species.map).toBeDefined();
  });
});
