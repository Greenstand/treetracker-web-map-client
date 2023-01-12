import { prepareNocks, clearNocks } from './nockRoutes';
import tree from '../../fixtures/tree186734.json';

beforeEach(() => {
  clearNocks();
});

describe('Money Tree', () => {
  it('get a money tree', () => {
    const path = `/trees/${tree.id}`;
    prepareNocks({ tree: { ...tree, species_name: 'Money Tree' } });
    // challenge: Use nocksIntercept to add the correct additional api calls for trees/:id route
    cy.visit(path);
    // misc code to confirm changes
    cy.get('.mui-nmovop > :nth-child(1)').contains(`Money Tree`);
  });
});
