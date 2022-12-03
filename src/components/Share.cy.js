import Share from './Share';
import shareIcon from '../img/icons/share.svg';
import { mountWithTheme as mount } from '../models/test-utils';

describe('Share', () => {
  before(() => {});

  it('Share', () => {
    function Test() {
      return (
        <Share
          shareUrl="https://www.google.com"
          icon={
            <div>
              <img alt="share the link" src={shareIcon} />
            </div>
          }
        />
      );
    }
    mount(<Test />);
    cy.get('.MuiBox-root').click().pause();
    cy.get('.css-1brzdu3 > .MuiButtonBase-root')
      .click()
      .contains(/copied!/i)
      .pause();
  });
});
