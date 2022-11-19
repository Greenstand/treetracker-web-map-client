import ThemePlayground from './theme';
import { mountWithTheme as mount } from '../../models/test-utils';

describe('Theme', () => {
  it('renders', () => {
    mount(<ThemePlayground />);
  });
});
