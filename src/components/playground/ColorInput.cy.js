import { PlaygroundProvider } from 'context/playgroundContext';
import { mountWithTheme as mount } from 'models/test-utils';
import ColorInput from './ColorInput';

describe('Color Input', () => {
  const name = 'main';
  const path = `palette.dark.primary.${name}`;

  it('renders', () => {
    mount(
      <PlaygroundProvider>
        <ColorInput label={name} path={path} />
      </PlaygroundProvider>,
    );
  });

  it('gives error on invalid syntax', () => {
    mount(
      <PlaygroundProvider>
        <ColorInput label={name} path={path} />
      </PlaygroundProvider>,
    );
    cy.get('.MuiFormControl-root').type('z').contains('Invalid syntax');
  });
});
