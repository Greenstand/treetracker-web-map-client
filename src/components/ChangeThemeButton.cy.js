import ChangeThemeButton from './ChangeThemeButton';
import { mountWithTheme as mount } from '../models/test-utils';

describe('Change Theme Button', () => {
  it('renders', () => {
    mount(<ChangeThemeButton />);
  });
});
