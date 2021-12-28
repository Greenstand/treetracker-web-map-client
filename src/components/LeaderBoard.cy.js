import { mountWithTheme as mount } from '../models/test-utils';
import LeaderBoard from './LeaderBoard';

describe('LeaderBoard', () => {
  it('renders', () => {
    cy.fixture('countries/leader').then(({ countries }) => {
      mount(<LeaderBoard countries={countries} />);
    });
  });
});
