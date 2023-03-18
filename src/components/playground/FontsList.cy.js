import { mountWithTheme as mount } from 'models/test-utils';
import FontsList from './FontsList';

describe('Change Theme Button', () => {
  const list = {
    Roboto: [],
    Arial: [],
    Montserrat: [],
    Lato: [],
  };

  it('renders with addable items', () => {
    mount(<FontsList title="Addable items list" list={list} canAddItems />);
    Object.keys(list).forEach((font) => {
      cy.get('.MuiAccordionDetails-root').contains(font);
    });
  });

  it('renders with non addable items', () => {
    mount(<FontsList title="Non addable items list" list={list} />);
    Object.keys(list).forEach((font) => {
      cy.get('.MuiAccordionDetails-root').contains(font);
    });
  });
});
