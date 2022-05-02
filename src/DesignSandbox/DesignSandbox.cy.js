import DesignSandbox from './DesignSandbox';
import { mountWithTheme as mount } from '../models/test-utils';

describe('designSandbox', () => {
  it('it shows designSandbox', () => {
    // cy.viewport(1440, 900);
    mount(<DesignSandbox />);
  });
});
