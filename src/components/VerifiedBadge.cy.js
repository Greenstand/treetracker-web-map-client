import VerifiedBadge from './VerifiedBadge';
import { mountWithTheme as mount } from '../models/test-utils';

describe('Verified Badge', () => {
  it('enabled', () => {
    mount(<VerifiedBadge verified badgeName="Tree Verified" />);
  });
  it('not enabled', () => {
    mount(<VerifiedBadge verified={false} badgeName="Tree Verified" />);
  });
});
