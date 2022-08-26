import CustomCard from './CustomCard';
import TreeIcon from '../../images/icons/tree.svg';
import { mountWithTheme as mount } from '../../models/test-utils';

describe('mount Card', () => {
  it('CustomCard', () => {
    const props = {
      iconURI: TreeIcon,
      title: 'Trees',
      text: '12',
      disabled: false,
    };

    mount(<CustomCard {...props} />);

    cy.viewport(390, 844);
    cy.screenshot();
    cy.viewport(1440, 800);
    cy.screenshot();
  });
});
