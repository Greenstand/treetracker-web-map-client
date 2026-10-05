import axios from 'axios';
import log from 'loglevel';
import apiPaths from 'models/apiPaths';
import { API_TIMEOUT_MS, describeError, requestAPI } from './utils';

export async function getFeaturedTrees() {
  try {
    const url = apiPaths.featuredTrees;
    const begin = Date.now();
    const res = await axios.get(url, { timeout: API_TIMEOUT_MS });
    const data = await res.data;
    log.warn('url:', url, 'took:', Date.now() - begin);
    return data.trees;
  } catch (err) {
    log.error(err.message);
    throw err;
  }
}

export async function getCountryLeaderboard() {
  try {
    const url = apiPaths.leaders;
    const begin = Date.now();
    const res = await axios.get(url, { timeout: API_TIMEOUT_MS });
    const data = await res.data;
    log.warn('url:', url, 'took:', Date.now() - begin);
    return data.countries;
  } catch (err) {
    log.error(err.message);
    throw err;
  }
}

export async function getOrganizationById(id) {
  try {
    const url = apiPaths.organization(id);
    const begin = Date.now();
    const res = await axios.get(url, { timeout: API_TIMEOUT_MS });
    const data = await res.data;
    log.warn('url:', url, 'took:', Date.now() - begin);
    return data;
  } catch (err) {
    log.error(err);
    throw err;
  }
}

export async function getCountryByLatLon(lat, lon) {
  try {
    const url = apiPaths.countriesLatLon(lat, lon);
    const begin = Date.now();
    const res = await axios.get(url, { timeout: API_TIMEOUT_MS });
    const data = await res.data;
    log.warn('url:', url, 'took:', Date.now() - begin);
    return data.countries[0];
  } catch (err) {
    log.error(err);
    throw err;
  }
}

export async function getPlanterById(id) {
  try {
    const url = apiPaths.planters(id);
    const begin = Date.now();
    const res = await axios.get(url, { timeout: API_TIMEOUT_MS });
    const data = await res.data;
    log.warn('url:', url, 'took:', Date.now() - begin);
    return data;
  } catch (err) {
    log.error(err.message);
    throw err;
  }
}

export async function getGrowerById(id) {
  try {
    const url = apiPaths.growers(id);
    const begin = Date.now();
    const res = await axios.get(url, { timeout: API_TIMEOUT_MS });
    const data = await res.data;
    log.warn('url:', url, 'took:', Date.now() - begin);
    return data;
  } catch (err) {
    log.error(err.message);
    throw err;
  }
}

export async function getStakeHolderById(id) {
  try {
    const url = apiPaths.stakeHolders(id);
    const begin = Date.now();
    const res = await axios.get(url, { timeout: API_TIMEOUT_MS });
    const { data } = res;
    log.warn('url:', url, 'took:', Date.now() - begin);
    return data;
  } catch (err) {
    log.error(err.message);
    throw err;
  }
}

export async function getTreeById(id) {
  try {
    const url = apiPaths.trees(id);
    const begin = Date.now();
    const res = await axios.get(url, { timeout: API_TIMEOUT_MS });
    const { data } = res;
    log.warn('url:', url, 'took:', Date.now() - begin);
    return data;
  } catch (err) {
    log.error(err.message);
    throw err;
  }
}
export async function getCapturesById(id) {
  try {
    const url = apiPaths.captures(id);
    const begin = Date.now();
    const res = await axios.get(url, { timeout: API_TIMEOUT_MS });
    const { data } = res;
    log.warn('url:', url, 'took:', Date.now() - begin);
    return data;
  } catch (err) {
    log.error(err.message);
    throw err;
  }
}

export async function getOrgLinks({
  featured_trees: treesUrl,
  associated_planters = null,
  associated_organizations = null,
  species: speciesUrl,
}) {
  const associatesUrl = associated_organizations || associated_planters;

  const resources = {
    featuredTrees: treesUrl,
    associates: associatesUrl,
    species: speciesUrl,
  };
  // a single failed sub-resource must not take down the whole page
  const results = await Promise.allSettled(
    Object.values(resources).map((url) => (url ? requestAPI(url) : null)),
  );
  const partialErrors = [];
  const [featuredTrees, associates, species] = results.map((result, i) => {
    if (result.status === 'fulfilled') return result.value ?? null;
    const resource = Object.keys(resources)[i];
    const info = describeError(result.reason);
    log.error('[getOrgLinks] failed', Object.values(resources)[i], info);
    partialErrors.push({ resource, ...info });
    return null;
  });

  return {
    featuredTrees,
    species,
    partialErrors,
    ...(associated_organizations && { associatedOrganizations: associates }),
    ...(associated_planters && { associatedPlanters: associates }),
  };
}

export async function getWalletById(id) {
  try {
    const url = apiPaths.wallets(id);
    const begin = Date.now();
    log.warn('url: ', url);
    const res = await axios.get(url, { timeout: API_TIMEOUT_MS });
    const { data } = res;
    log.warn('url:', url, 'took:', Date.now() - begin);
    return data;
  } catch (err) {
    log.error(err);
    throw err;
  }
}

export async function getSpeciesByWalletId(id) {
  try {
    const url = apiPaths.filterSpeciesByWalletId(id);
    const begin = Date.now();
    const res = await axios.get(url, { timeout: API_TIMEOUT_MS });
    log.warn('url: ', url);
    const { data } = res;
    log.warn('url:', url, 'took:', Date.now() - begin);
    return data;
  } catch (err) {
    log.error(err);
    throw err;
  }
}

export async function getTokenById(id) {
  try {
    const url = apiPaths.tokens(id);
    const begin = Date.now();
    const res = await axios.get(url, { timeout: API_TIMEOUT_MS });
    log.warn('url:', url);
    const { data } = res;
    log.warn('url:', url, 'took:', Date.now() - begin);
    return data;
  } catch (err) {
    log.error(err);
    throw err;
  }
}
