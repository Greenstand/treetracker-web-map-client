import * as NextRouter from 'next/router';
import Timeline from './Timeline';
import { mountWithTheme as mount } from '../models/test-utils';

describe('Timeline', () => {
  describe('given page is top', () => {
    beforeEach(() => {
      const pathname = '/top';
      cy.stub(NextRouter, 'useRouter').returns({ pathname });
    });

    it('should render on desktop', () => {
      mount(<Timeline />);
    });

    it('should render on mobile', () => {
      cy.viewport('iphone-6');
      mount(<Timeline />);
    });
  });

  describe('given page is index|home', () => {
    beforeEach(() => {
      const pathname = '/';
      cy.stub(NextRouter, 'useRouter').returns({ pathname });
    });

    it('should render on desktop', () => {
      mount(<Timeline />);
    });

    it('should render on mobile', () => {
      cy.viewport('iphone-6');
      mount(<Timeline />);
    });
  });

  describe('given page is not top', () => {
    beforeEach(() => {
      const pathname = '/planters';
      cy.stub(NextRouter, 'useRouter').returns({ pathname });
    });

    it('should not render on desktop', () => {
      mount(<Timeline />);
      cy.get('.MuiBox-root').should('not.exist');
    });

    it('should not render on mobile', () => {
      cy.viewport('iphone-6');
      mount(<Timeline />);
      cy.get('.MuiBox-root').should('not.exist');
    });
  });
});
