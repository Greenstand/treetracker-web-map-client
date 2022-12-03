import PlanterQuote from './PlanterQuote';
import { mountWithTheme as mount } from '../models/test-utils';

beforeEach(() => {
  cy.intercept('/_next/static/img/quote-reverse**', {
    fixture: 'images/quote-reverse.svg',
  });
  cy.intercept('/_next/static/img/quote-symbol**', {
    fixture: 'images/quote-symbol.svg',
  });
  cy.intercept('/_next/**greenway**', {
    fixture: 'images/greenway-international.png',
  });
});

const info = {
  quote:
    'I love how planting trees gives me the opportunity to feed my family and save the world at the same time. I try to plant as many trees as I can.',
  name: 'Samwell A',
  photo: '/img/greenway-international.png',
  initialDate: 'November 11, 2020',
  location: 'Shiramtunda, Tanzania',
};

describe('PlanterQuote', () => {
  it('PlanterQuoteDesktop', () => {
    cy.viewport(720, 360);
    mount(<PlanterQuote planter={info} />);
  });
  it('PlanterQuoteDesktopReverse', () => {
    cy.viewport(720, 360);
    mount(<PlanterQuote planter={info} reverse />);
  });
  it('PlanterQuoteMobile', () => {
    cy.viewport(375, 500);
    mount(<PlanterQuote planter={info} />);
  });
});
