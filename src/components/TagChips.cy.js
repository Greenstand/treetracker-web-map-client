import TagChips from './TagChips';
import { mountWithTheme as mount } from '../models/test-utils';

const mockTagItems = [
  'Africa',
  'Americas',
  'Asia',
  'Caribbean',
  'Europe',
  'Oceania',
];

describe('Tag Chip Test', () => {
  beforeEach(() => {
    cy.viewport(1440, 900);
  });

  mockTagItems.forEach((mockTagItem) => {
    it(`Displays correct styling for ${mockTagItem} tag upon clicking and checks for the parameter passed to callback func`, () => {
      const handleSelectTag = cy.stub();

      mount(<TagChips tagItems={mockTagItems} onSelectTag={handleSelectTag} />);

      // Assert styling for the tag clicked and check parameter passed to callback function
      cy.contains(`${mockTagItem}`)
        .closest('.MuiChip-root')
        .click()
        .should('have.class', 'MuiChip-filled')
        .then(() => {
          expect(handleSelectTag).to.be.calledWith(`${mockTagItem}`);
        });

      // Assert styling for the non-selected tags
      mockTagItems.forEach((item) => {
        if (item !== mockTagItem) {
          cy.contains(`${item}`)
            .closest('.MuiChip-root')
            .should('not.have.class', 'MuiChip-filled')
            .should('have.class', 'MuiChip-outlined');
        }
      });
    });
  });
});
