import SelectTypographyProp from './SelectTypographyProp';
import { PlaygroundProvider } from '../../context/playgroundContext';
import { mountWithTheme as mount } from '../../models/test-utils';

describe('Select Typography Prop', () => {
  const path = 'typography.h1';
  const prop = {
    propName: 'h1',
    options: [
      'fontFamily',
      'fontWeight',
      'fontSize',
      'lineHeight',
      'letterSpacing',
    ],
  };

  it('renders', () => {
    mount(
      <PlaygroundProvider>
        <SelectTypographyProp path={path} prop={prop} />
      </PlaygroundProvider>,
    );
    cy.get(`#select-typography-${prop.propName}-header`).contains(
      prop.propName,
    );
    cy.get(`#select-typography-${prop.propName}-header`).click();
    cy.get('.MuiList-root').should('be.visible');
  });
});
