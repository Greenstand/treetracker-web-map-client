import { PlaygroundProvider } from 'context/playgroundContext';
import { mountWithTheme as mount } from 'models/test-utils';
import FontAddInput from './FontAddInput';

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
    cy.get('.MuiFormControl-root').eq(0).type('lora{enter}');
    cy.get('.MuiFormControl-root')
      .eq(0)
      .contains('Font could not be loaded')
      .should('not.exist');
  });

  it('error when searching non existinig font', () => {
    mount(
      <PlaygroundProvider>
        <FontAddInput />
      </PlaygroundProvider>,
    );
    cy.get('.MuiAccordionSummary-content').click();
    cy.get('.MuiFormControl-root').as('formControl');
    cy.get('@formControl')
      .eq(0)
      .type('void void vpid{enter}', { timeout: 4000 })
      .as('invalidFont');
    cy.get('@invalidFont').eq(0).contains('Font could not be loaded');
  });
});
