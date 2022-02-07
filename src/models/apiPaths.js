import { urlJoin } from 'url-join-ts';

const host = process.env.NEXT_PUBLIC_API || '';
const apiPaths = {
  featuredTrees: urlJoin(host, '/trees/featured'),
  leaders: urlJoin(host, '/countries/leaderboard'),
};

export default apiPaths;
