import SearchButton from './SearchButton';
import { mountWithTheme as mount } from '../models/test-utils';

describe('Search Button', () => {
  it('renders', () => {
    mount(<SearchButton />);
  });
});
