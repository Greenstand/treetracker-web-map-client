import TreeSpeciesCard from './TreeSpeciesCard';
import { mountWithTheme as mount } from '../models/test-utils';

describe('TreeSpeciesCard', () => {
  it('renders', () => {
    mount(<TreeSpeciesCard />);
  });
});
