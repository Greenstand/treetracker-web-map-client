import FontSelector from './FontSelector';
import { PlaygroundProvider } from '../../context/playgroundContext';
import { mountWithTheme as mount } from '../../models/test-utils';

describe('Font Selector', () => {
  const defaultFonts = [
    { name: 'Lato', weights: [] },
    { name: 'Monstserrat', weights: [] },
    { name: 'Roboto', weights: [] },
  ];

  it('renders', () => {
    mount(
      <PlaygroundProvider>
        <FontSelector />
      </PlaygroundProvider>,
    );
    cy.get('[data-testid=AddIcon]').click();
    defaultFonts.forEach((font) => {
      cy.get('.MuiList-root').contains(font.name);
    });
  });
});
