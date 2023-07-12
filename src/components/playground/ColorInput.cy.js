import { PlaygroundProvider } from 'context/playgroundContext';
import { mountWithTheme as mount } from 'models/test-utils';
import { themeEditorConfig } from 'models/themePlaygroundOptions';
import ColorInput from './ColorInput';

describe('Color Input', () => {
  const propName = 'main';
  const pathToProp = `palette.dark.primary`;
  const prop = themeEditorConfig.palette.primary;

  it('renders', () => {
    mount(
      <PlaygroundProvider>
        <ColorInput prop={prop} propName={propName} pathToProp={pathToProp} />
      </PlaygroundProvider>,
    );
  });

  it('gives error on invalid syntax', () => {
    mount(
      <PlaygroundProvider>
        <ColorInput prop={prop} propName={propName} pathToProp={pathToProp} />
      </PlaygroundProvider>,
    );
    cy.get('.MuiFormControl-root').type('z');
    cy.get('.MuiFormControl-root').contains('Invalid syntax');
  });
});
