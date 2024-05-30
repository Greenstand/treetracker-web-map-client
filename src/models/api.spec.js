import log from 'loglevel';
import {
  getCountryLeaderboard,
  getFeaturedTrees,
  getOrganizationById,
  getOrgLinks,
  getGrowerById,
  getTreeById,
} from './api';
import organization from '../../doc/examples/organizations/1.json';

it('should get grower by id', async () => {
  const grower = await getGrowerById(100);
  expect(grower).toBeDefined();
  expect(grower.first_name).toBeDefined();
});

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

describe('getTreeById', () => {
  it('should get tree by id', async () => {
    const id = 'da4d3ed8-8655-44c5-a7ba-d4c45a0dfb10';
    const tree = await getTreeById(id);
    expect(tree).toBeDefined();
    expect(tree.name).toBeDefined();
  });
});
