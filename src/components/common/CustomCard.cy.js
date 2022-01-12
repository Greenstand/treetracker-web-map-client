import CustomCard from './CustomCard';
import { mountWithTheme as mount } from '../../models/test-utils';

describe('mount Card', () => {
  it('CustomCard', () => {
    mount(<CustomCard />);
  });
});
