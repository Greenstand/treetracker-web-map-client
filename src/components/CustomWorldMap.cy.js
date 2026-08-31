import { mountWithTheme as mount } from 'models/test-utils';
import CustomWorldMap from './CustomWorldMap';

describe('CustomWorldMap', () => {
  it('renders', () => {
    mount(<CustomWorldMap totalTrees={10} con="af" />);
  });

  it('shows 0 instead of NaN for missing tree counts', () => {
    mount(<CustomWorldMap totalTrees={undefined} con="af" />);

    cy.contains('0').should('exist');
    cy.contains('NaN').should('not.exist');
  });
});
