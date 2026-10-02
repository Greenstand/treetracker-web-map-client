import { urlJoin } from 'url-join-ts';
import { getEnv } from 'models/runtimeEnv';

// Read at call time so the runtime NEXT_PUBLIC_API is used.
const host = () => getEnv('NEXT_PUBLIC_API') || '';
const hostV2 = process.env.NEXT_PUBLIC_API_V2 || '';
const apiPaths = {
  get featuredTrees() {
    return urlJoin(host(), '/trees/featured');
  },
  countriesLatLon: (lat = '', lon = '') =>
    urlJoin(host(), `/countries?lat=${lat}&lon=${lon}`),
  get leaders() {
    return urlJoin(host(), '/countries/leaderboard');
  },
  trees: (id = '') => urlJoin(host(), `/trees/${id}`),
  captures: (id = '') => urlJoin(host(), `/v2/captures/${id}`),
  growers: (id = '') => urlJoin(host(), `/grower-accounts/${id}`),
  planters: (id = '') => urlJoin(host(), `/planters/${id}`),
  stakeHolders: (id = '') => urlJoin(hostV2, `/stakeholder/stakeholders/${id}`),
  get species() {
    return urlJoin(host(), '/species');
  },
  organization: (id = '') => urlJoin(host(), `/organizations/${id}`),
  wallets: (id = '') => urlJoin(host(), `/wallets/${id}`),
  filterSpeciesByWalletId: (id = '') =>
    urlJoin(host(), `/species?wallet_id=${id}`),
  tokens: (id = '') => urlJoin(host(), `/tokens/${id}`),
};

export default apiPaths;
