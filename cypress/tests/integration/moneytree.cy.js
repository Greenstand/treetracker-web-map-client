import { prepareNocks, clearNocks } from './nockRoutes';
import tree from '../../fixtures/tree186734.json';

beforeEach(() => {
  clearNocks();
});

describe('Money Tree', () => {
  it('get a money tree', () => {
    const path = `/trees/${tree.id}`;
    prepareNocks({ tree: { ...tree, species_name: 'Money Tree' } });
    // nocksIntercept for extra data that I want to show up
    cy.visit(path);
    // misc code to confirm changes
    cy.get('.mui-nmovop > :nth-child(1)').contains(`Money Tree`);
  });
});
