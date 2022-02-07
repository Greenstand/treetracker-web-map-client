/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import apiPaths from 'models/apiPaths';
import { requestAPI } from './utils';

export async function getFeaturedTrees() {
  try {
    const url = apiPaths.featuredTrees;
    const res = await axios.get(url);
    const data = await res.data;
    return data.trees;
  } catch (err) {
    return console.error(err.message);
  }
}

export async function getCountryLeaderboard() {
  try {
    const url = apiPaths.leaders;
    const res = await axios.get(url);
    const data = await res.data;
    return data.countries;
  } catch (err) {
    return console.error(err.message);
  }
}

export async function getOrganizationById(id) {
  try {
    const url = apiPaths.organization(id);
    const res = await axios.get(url);
    const data = await res.data;
    return data;
  } catch (err) {
    return console.error(err.message);
  }
}

export async function getPlanterById(id) {
  try {
    const url = apiPaths.planters(id);
    const res = await axios.get(url);
    const data = await res.data;
    return data;
  } catch (err) {
    return console.error(err.message);
  }
}

export async function getOrgLinks(organization) {
  try {
    const {
      featured_trees,
      associated_planters,
      species: species_url,
    } = organization.links;
    const featuredTrees = await requestAPI(featured_trees);
    const associatedPlanters = await requestAPI(associated_planters);
    const species = await requestAPI(species_url);

    return { featuredTrees, associatedPlanters, species };
  } catch (err) {
    return console.error(err.message);
  }
}
