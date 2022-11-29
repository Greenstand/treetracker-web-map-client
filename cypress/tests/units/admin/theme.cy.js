import ThemePlayground from '../../../../src/pages/admin/theme';
import { mountWithTheme as mount } from '../../../../src/models/test-utils';

describe('Theme', () => {
  it('renders', () => {
    mount(<ThemePlayground />);
  });
});
