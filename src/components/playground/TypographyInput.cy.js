import { PlaygroundProvider } from 'context/playgroundContext';
import { mountWithTheme as mount } from 'models/test-utils';
import TypographyInput from './TypographyInput';

describe('Typography Input', () => {
  it('renders fontFamily', () => {
    const name = 'fontFamily';
    const path = `typography.h1.${name}`;
    const value = 'Montserrat';

    mount(
      <PlaygroundProvider>
        <TypographyInput path={path} label={name} />
      </PlaygroundProvider>,
    );
    cy.get('.MuiFormControl-root').contains(name);
    cy.get('input').should('have.value', value);
  });
});
