import PageLoadError from './PageLoadError';
import { mountWithThemeAndRouter as mount } from '../../models/test-utils';

describe('PageLoadError tests', () => {
  it('shows the banner and Retry button with no skeleton placeholders', () => {
    mount(<PageLoadError entityLabel="Tree" id="abc" />);
    cy.get('[data-testid="page-load-error"]').should('exist');
    cy.contains(
      "We couldn't load this tree's details right now. The map is still available.",
    );
    cy.contains('button', 'Retry');
    cy.get('.MuiSkeleton-root').should('not.exist');
  });
});
