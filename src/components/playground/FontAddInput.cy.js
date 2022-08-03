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
    cy.get('.MuiFormControl-root').eq(0).type('lora');
    cy.get('.MuiFormControl-root').eq(1).type('700');
    cy.get('button').click();
    cy.get('.MuiFormControl-root')
      .eq(0)
      .contains('Font could not be loaded')
      .should('not.exist');
  });

  it('multiple scenarios for loading font', () => {
    mount(
      <PlaygroundProvider>
        <FontAddInput />
      </PlaygroundProvider>,
    );
    cy.get('.MuiAccordionSummary-content').click();
    cy.get('.MuiFormControl-root').eq(0).type('lora');
    cy.get('.MuiFormControl-root').eq(1).type('700');
    cy.get('button').click();

    cy.get('.MuiFormControl-root input').eq(0).clear();
    cy.get('.MuiFormControl-root input').eq(1).clear();
    cy.get('.MuiFormControl-root').eq(0).type('lora');
    cy.get('.MuiFormControl-root').eq(1).type('700');
    cy.get('button').click();
    cy.get('.MuiFormControl-root').eq(0).contains('Font Already Loaded');

    cy.get('.MuiFormControl-root input').eq(0).clear();
    cy.get('.MuiFormControl-root input').eq(1).clear();
    cy.get('.MuiFormControl-root').eq(0).type('lora');
    cy.get('.MuiFormControl-root').eq(1).type(' 700,400 ');
    cy.get('button').click();
    cy.get('.MuiFormControl-root')
      .eq(0)
      .contains('Font Already Loaded')
      .should('not.exist');
  });

  it('error when searching non existinig font', () => {
    mount(
      <PlaygroundProvider>
        <FontAddInput />
      </PlaygroundProvider>,
    );
    cy.get('.MuiAccordionSummary-content').click();
    cy.get('.MuiFormControl-root').eq(0).type('void void vpid');
    cy.get('button').click();
    cy.get('.MuiFormControl-root').eq(0).contains('Font could not be loaded');
  });
});
