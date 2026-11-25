import { Box } from '@mui/material';
import { mountWithThemeAndRouter as mount } from 'models/test-utils';
import Navbar from './Navbar';

const menuButton = 'button[aria-controls="basic-menu"]';
const menu = '#basic-menu';

// The layouts put the navbar in a flex column. Only there its z-index puts
// the menu button above the backdrop of the open menu.
function mountMobile() {
  cy.viewport(390, 844);
  mount(
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Navbar />
    </Box>,
  );
}

function openMenu() {
  cy.get(menuButton).click();
  cy.get(menu).contains('li', 'Blog').should('be.visible');
}

beforeEach(() => {
  cy.intercept('/_next/**', {
    fixture: 'images/greenstand_logo_full.png',
  });
});

describe('Navbar tests', () => {
  it('navbar-mobile', () => {
    mount(<Navbar />);
    cy.viewport(700, 900);
    cy.get('button[aria-controls="basic-menu"]')
      .click()
      .get('li')
      .contains('Treetracker');
    cy.get('li').contains('Blog');
  });

  describe('mobile menu', () => {
    beforeEach(() => {
      mountMobile();
      openMenu();
    });

    it('closes on Escape', () => {
      cy.focused().type('{esc}');
      cy.get(menu).should('not.exist');
    });

    it('closes on a click outside the menu', () => {
      cy.get(`${menu} .MuiBackdrop-root`).click(200, 700);
      cy.get(menu).should('not.exist');
    });

    it('closes on a second click on the menu button', () => {
      cy.get(menuButton).click();
      cy.get(menu).should('not.exist');
    });

    it('closes on a click on a menu item', () => {
      // The item links to another site: stay on the test page.
      cy.get(menu)
        .contains('li a', 'Blog')
        .then(($link) => $link.on('click', (e) => e.preventDefault()))
        .click();
      cy.get(menu).should('not.exist');
    });
  });

  it('navbar', () => {
    mount(<Navbar />);
    cy.viewport(1100, 900);
    cy.get('Button').contains('Blog');
  });
});
