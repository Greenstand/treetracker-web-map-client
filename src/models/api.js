/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import log from 'loglevel';
import apiPaths from 'models/apiPaths';
import { requestAPI } from './utils';

export async function getFeaturedTrees() {
  try {
    const url = apiPaths.featuredTrees;
    const res = await axios.get(url);
    const data = await res.data;
    return data.trees;
  } catch (err) {
    log.error(err.message);
    throw new Error(err.message);
  }
}

export async function getCountryLeaderboard() {
  try {
    const url = apiPaths.leaders;
    const res = await axios.get(url);
    const data = await res.data;
    return data.countries;
  } catch (err) {
    log.error(err.message);
    throw new Error(err.message);
  }
}

export async function getOrganizationById(id) {
  try {
    const url = apiPaths.organization(id);
    const res = await axios.get(url);
    const data = await res.data;
    return data;
  } catch (err) {
    log.error(err.message);
    throw new Error(err.message);
  }
}

export async function getPlanterById(id) {
  try {
    const url = apiPaths.planters(id);
    const res = await axios.get(url);
    const data = await res.data;
    return data;
  } catch (err) {
    log.error(err.message);
    throw new Error(err.message);
  }
}

export async function getTreeById(id) {
  try {
    const url = apiPaths.trees(id);
    const res = await axios.get(url);
    const { data } = res;
    return data;
  } catch (err) {
    log.error(err.message);
    throw new Error(err.message);
  }
}

export async function getOrgLinks(organization) {
  const {
    featured_trees: treesUrl,
    associated_planters = null,
    associated_organizations = null,
    species: speciesUrl,
  } = organization.links;

  const associatesUrl = associated_organizations || associated_planters;

  const [featuredTrees, associates, species] = await Promise.all(
    [treesUrl, associatesUrl, speciesUrl].map(requestAPI),
  );

  return {
    featuredTrees,
    species,
    ...(associated_organizations && { associatedOrganizations: associates }),
    ...(associated_planters && { associatedPlanters: associates }),
  };
}
