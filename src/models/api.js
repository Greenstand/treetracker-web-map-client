/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import apiPaths from 'models/apiPaths';

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
