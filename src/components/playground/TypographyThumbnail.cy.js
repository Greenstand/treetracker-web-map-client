import { PlaygroundProvider } from 'context/playgroundContext';
import { mountWithTheme as mount } from 'models/test-utils';
import TypographyThumbnail from './TypographyThumbnail';

describe('Typography Thumbnail', () => {
  const prop = 'h1';
  const path = `typography.${prop}`;

  it('renders', () => {
    mount(
      <PlaygroundProvider>
        <TypographyThumbnail text={`style for ${prop}`} path={path} />,
      </PlaygroundProvider>,
    );
    cy.contains(`style for ${prop}`);
  });
});
