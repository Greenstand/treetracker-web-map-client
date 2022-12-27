import { mountWithTheme as mount } from '../../../../src/models/test-utils';
import ThemePlayground from '../../../../src/pages/admin/theme';

describe('Theme', () => {
  it('renders', () => {
    mount(<ThemePlayground />);
  });
});
