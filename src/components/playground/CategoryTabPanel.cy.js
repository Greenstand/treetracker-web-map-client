import { mountWithTheme as mount } from 'models/test-utils';
import CategoryTabPanel from './CategoryTabPanel';

describe('Category Tab Panel', () => {
  it('renders if tab index is equal', () => {
    mount(
      <CategoryTabPanel value={0} index={0}>
        children here
      </CategoryTabPanel>,
    );
  });

  it('does not render if tab index is not equal', () => {
    mount(
      <CategoryTabPanel value={1} index={0}>
        children here
      </CategoryTabPanel>,
    );
  });
});
