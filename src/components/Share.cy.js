import Share from './Share';
import shareIcon from '../images/icons/share.svg';
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
    cy.get(
      '.MuiDialog-container > .MuiPaper-root > .MuiGrid-root > .MuiButtonBase-root:first',
    )
      .click()
      .pause();
    cy.get('.MuiButton-root').contains(/copy/i).click();
  });
});
