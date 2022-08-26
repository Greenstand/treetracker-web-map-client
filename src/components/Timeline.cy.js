import Timeline from './Timeline';
import { mountWithTheme as mount } from '../models/test-utils';

describe('Timeline', () => {
  it('renders on desktop', () => {
    mount(<Timeline />);
  });

  it('renders on mobile', () => {
    cy.viewport('iphone-6');
    mount(<Timeline />);
  });
});
