export const DEFAULT_FEATURED_TREES_SPECIES = 'West-Smith-Nayer';

export function getTreeSpecies(tree) {
  if (!tree) return DEFAULT_FEATURED_TREES_SPECIES;
  if (tree.species_name) return tree.species_name;
  if (tree.species) return tree.species;
  if (tree.country_name) return tree.country_name;

  return DEFAULT_FEATURED_TREES_SPECIES;
}