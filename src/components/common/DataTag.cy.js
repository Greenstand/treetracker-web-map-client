import DataTag from './DataTag';
import { mountWithTheme as mount } from '../../models/test-utils';

describe('DataTag', () => {
  it('DataTag', () => {
    mount(<DataTag data="Shirimatunda,Tanzania" location />);
  });
});
