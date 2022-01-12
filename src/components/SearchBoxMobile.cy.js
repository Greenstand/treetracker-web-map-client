import { mount } from '@cypress/react';
import SearchBox from './SearchBoxMobile';

describe('SearchBox', () => {
  it('searchBox', () => {
    mount(<SearchBox />);
  });
});
