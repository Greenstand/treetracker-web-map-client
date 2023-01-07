import { PlaygroundProvider } from 'context/playgroundContext';
import { mountWithTheme as mount } from 'models/test-utils';
import ColorThumbnail from './ColorThumbnail';

describe('Color Thumbnail', () => {
  const path = 'palette.dark.primary.main';

  it('renders', () => {
    // thumbnail adjusts to height of parent
    mount(
      <PlaygroundProvider>
        <div style={{ height: '24px' }}>
          <ColorThumbnail path={path} />
        </div>
      </PlaygroundProvider>,
    );
  });
});
