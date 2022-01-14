import CustomWorldMap from './CustomWorldMap';
import { mountWithTheme as mount } from '../models/test-utils';

describe('CustomWorldMap', () => {
  it('renders', () => {
    mount(<CustomWorldMap />);
  });
});
