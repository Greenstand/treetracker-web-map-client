import { mountWithTheme as mount } from 'models/test-utils';
import DataTag from './DataTag';

describe('DataTag', () => {
  it('DataTag', () => {
    mount(<DataTag data="Shirimatunda,Tanzania" location />);
  });
});
