import SelectTypographyProp from './SelectTypographyProp';
import { PlaygroundProvider } from '../../context/playgroundContext';
import { mountWithTheme as mount } from '../../models/test-utils';

describe('Select Typography Prop', () => {
  const path = 'typography.h1';
  const prop = 'h1';

  it('renders', () => {
    mount(
      <PlaygroundProvider>
        <SelectTypographyProp path={path} prop={prop} />
      </PlaygroundProvider>,
    );
    cy.get('#select-typography-h1-header').contains(prop);
    cy.get('#select-typography-h1-header').click();
    cy.get('.MuiList-root').should('be.visible');
  });
});
