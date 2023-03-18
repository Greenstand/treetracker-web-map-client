import { PlaygroundProvider } from 'context/playgroundContext';
import { mountWithTheme as mount } from 'models/test-utils';
import SelectColorProp from './SelectColorProp';

describe('Select Color Prop', () => {
  const path = 'palette.light.primary';
  const prop = {
    propName: 'primary',
    options: ['main', 'light', 'dark', 'contrastText'],
  };

  it('renders', () => {
    mount(
      <PlaygroundProvider>
        <SelectColorProp path={path} prop={prop} />
      </PlaygroundProvider>,
    );
    cy.get(`#select-color-${prop.propName}-header`).contains(prop.propName);
    cy.get(`#select-color-${prop.propName}-header`).click();
    cy.get('.MuiList-root').should('be.visible');
  });
});
