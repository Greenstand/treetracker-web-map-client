import TypographyThumbnail from './TypographyThumbnail';
import { mountWithTheme as mount } from '../../models/test-utils';

describe('Typography Thumbnail', () => {
  const prop = 'h1';
  const styleProps = {
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: '48px',
    lineHeight: '63px',
    letterSpacing: '-0.01562em',
  };

  it('renders', () => {
    mount(
      <TypographyThumbnail
        text={`style for ${prop}`}
        previewStyle={styleProps}
      />,
    );
    cy.contains(`style for ${prop}`);
  });
});
