import LikeButton from './LikeButton';
import { mountWithTheme as mount } from '../models/test-utils';

describe('LikeButton', () => {
  it('LikeButton', () => {
    mount(<LikeButton />);
  });
});
