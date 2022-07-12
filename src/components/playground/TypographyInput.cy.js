import TypographyInput from './TypographyInput';
import { PlaygroundProvider } from '../../context/playgroundContext';
import { mountWithTheme as mount } from '../../models/test-utils';

describe('Typography Input', () => {
  it('renders fontFamily', () => {
    const name = 'fontFamily';
    const value = 'Lato';

    mount(
      <PlaygroundProvider>
        <TypographyInput label={name} initial={value} onChange={console.log} />
      </PlaygroundProvider>,
    );
    cy.get('.MuiFormControl-root').contains(name);
    cy.get('input').should('have.value', value);
    cy.get('[data-testid=AddIcon]');
  });
});
