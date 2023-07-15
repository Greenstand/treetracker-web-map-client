import { mountWithTheme as mount } from 'models/test-utils';
import TreeSpeciesCard from './TreeSpeciesCard';

describe('TreeSpeciesCard', () => {
  it('renders', () => {
    mount(
      <TreeSpeciesCard
        name="Rhizophora mucronata"
        subTitle="Learn more"
        count={100}
      />,
    );
  });
});
