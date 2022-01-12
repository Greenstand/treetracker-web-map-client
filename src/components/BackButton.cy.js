import BackButton from './BackButton';
import { mountWithTheme as mount } from '../models/test-utils';

describe('BackButton', () => {
  it('renders', () => {
    mount(<BackButton />);
  });
});
