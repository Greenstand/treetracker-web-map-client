import { DEFAULT_FEATURED_TREES_SPECIES, getTreeSpecies } from './trees';

describe('Trees Model', () => {
  it('getTreeSpecies', () => {
    const tree1 = {
      country_name: 'Tanzania',
      species: 'Palm tree'
    }
    const tree2 = {
      country_name: 'Tanzania',
      species: null,
      species_name: 'SpeciesName'
    }
    const tree3 = {
      country_name: 'Tanzania',
      species: 'Palm tree',
      species_name: 'SpeciesName'
    }
    const tree4 = {
      country_name: null,
      species: null,
      species_name: null,
    }
    const tree5 = {
      country_name: 'Tanzania',
      species: null,
      species_name: null,
    }

    expect(getTreeSpecies(tree1)).toBe('Palm tree');
    expect(getTreeSpecies(tree2)).toBe('SpeciesName');
    expect(getTreeSpecies(tree3)).toBe('SpeciesName');
    expect(getTreeSpecies(tree4)).toBe(DEFAULT_FEATURED_TREES_SPECIES);
    expect(getTreeSpecies(tree5)).toBe('Tanzania');
  })
})