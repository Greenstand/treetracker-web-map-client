import { mountWithTheme as mount } from 'models/test-utils';
import CustomLogo from './CustomLogo';

describe('CustomLogo', () => {
  it('renders', () => {
    mount(<CustomLogo />);
  });
});
