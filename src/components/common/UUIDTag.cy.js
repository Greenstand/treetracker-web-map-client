import UUIDTag from './UUIDTag';

describe('UUIDTag', () => {
  beforeEach(() => {
    cy.viewport(500, 500);
  });

  it('renders correctly with a valid UUID string', () => {
    const testId = '12345678';
    cy.mount(<UUIDTag uuid={testId} />);
    cy.contains('1234...5678').should('exist');
  });

  it('handles non-string UUID values gracefully', () => {
    const testIdNonString = 12345678;
    cy.mount(<UUIDTag uuid={testIdNonString} />);
    cy.contains('1234...5678').should('exist');
  });

  it('displays a fallback for undefined UUID', () => {
    cy.mount(<UUIDTag uuid={undefined} />);
    cy.contains('...').should('exist');
  });
});
