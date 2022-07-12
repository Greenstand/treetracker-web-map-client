import SelectColorProp from './SelectColorProp';
import { PlaygroundProvider } from '../../context/playgroundContext';
import { mountWithTheme as mount } from '../../models/test-utils';

describe('Select Color Prop', () => {
  const path = 'palette.light.primary';
  const prop = 'main';

  it('renders', () => {
    mount(
      <PlaygroundProvider>
        <SelectColorProp path={path} prop={prop} />
      </PlaygroundProvider>,
    );
    cy.get('#select-color-main-header').contains(prop);
    cy.get('#select-color-main-header').click();
    cy.get('.MuiList-root').should('be.visible');
  });
});
