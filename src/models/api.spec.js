import { getCountryLeaderboard, getFeaturedTrees } from './api';

it('should get featured trees', async () => {
  const trees = await getFeaturedTrees();
  expect(trees).toBeDefined();
});

it('should get country leaderboard', async () => {
  const trees = await getCountryLeaderboard();
  expect(trees).toBeDefined();
});
