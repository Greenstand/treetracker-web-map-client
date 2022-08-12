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
    cy.get('.MuiFormControl-root').eq(0).type('void void vpid{enter}');
    cy.get('.MuiFormControl-root').eq(0).contains('Font could not be loaded');
  });
});
