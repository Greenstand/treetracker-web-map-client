import React from 'react';

import { mountWithTheme as mount } from '../models/test-utils';
import PlanterQuote from './PlanterQuote';

beforeEach(() => {
  cy.intercept('/_next/**', {
    fixture: 'images/greenway-international.png',
  });
  cy.intercept('/_next/image?url=%2Fimages%2Fquote-symbol.svg**', {
    fixture: 'images/quote-symbol.svg',
  });
  cy.viewport(720, 360);
});

const info = {
  quote:
    '“I love how planting trees gives me the opportunity to feed my family and save the world at the same time. I try to plant as many trees as I can.”',
  name: 'Samwell A',
  photo: '/images/greenway-international.png',
  initialDate: 'November 11, 2020',
  location: 'Shiramtunda, Tanzania',
};

describe('PlanterQuote', () => {
  it('PlanterQuote', () => {
    mount(<PlanterQuote {...info} />);
  });
});
