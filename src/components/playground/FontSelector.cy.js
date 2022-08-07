import FontSelector from './FontSelector';
import { PlaygroundProvider } from '../../context/playgroundContext';
import { mountWithTheme as mount } from '../../models/test-utils';

describe('Font Selector', () => {
  const defaultFonts = {
    Lato: [],
    Montserrat: [],
    Roboto: [],
  };

  it('renders', () => {
    mount(
      <PlaygroundProvider>
        <FontSelector />
      </PlaygroundProvider>,
    );
    cy.get('[data-testid=AddIcon]').click();
    Object.keys(defaultFonts).forEach((font) => {
      cy.get('.MuiList-root').contains(font);
    });
  });
});
