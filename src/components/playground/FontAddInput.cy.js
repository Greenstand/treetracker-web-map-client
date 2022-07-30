import FontAddInput from './FontAddInput';
import { PlaygroundProvider } from '../../context/playgroundContext';
import { mountWithTheme as mount } from '../../models/test-utils';

describe('Toggle Theme Mode', () => {
  it('renders', () => {
    mount(
      <PlaygroundProvider>
        <FontAddInput />
      </PlaygroundProvider>,
    );
  });

  it('can find searched font', () => {
    mount(
      <PlaygroundProvider>
        <FontAddInput />
      </PlaygroundProvider>,
    );
    cy.get('.MuiAccordionSummary-content').click();
    cy.get('.MuiFormControl-root').type('Splash{enter}');
    cy.get('[data-testid=AddIcon]');
  });

  it('error when searching non existinig font', () => {
    mount(
      <PlaygroundProvider>
        <FontAddInput />
      </PlaygroundProvider>,
    );
    cy.get('.MuiAccordionSummary-content').click();
    cy.get('.MuiFormControl-root')
      .type('nonexisting{enter}')
      .contains('Font could not be loaded');
  });
});
