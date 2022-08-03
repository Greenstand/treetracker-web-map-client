import FontsList from './FontsList';
import { mountWithTheme as mount } from '../../models/test-utils';

describe('Change Theme Button', () => {
  const list = [
    { name: 'Roboto', weights: [] },
    { name: 'Arial', weights: [] },
    { name: 'Montsrrat', weights: [] },
    { name: 'Lato', weights: [] },
  ];

  it('renders with addable items', () => {
    mount(<FontsList title="Addable items list" list={list} canAddItems />);
    list.forEach((font) => {
      cy.get('.MuiAccordionDetails-root').contains(font.name);
    });
  });

  it('renders with non addable items', () => {
    mount(<FontsList title="Non addable items list" list={list} />);
    list.forEach((font) => {
      cy.get('.MuiAccordionDetails-root').contains(font.name);
    });
  });
});
