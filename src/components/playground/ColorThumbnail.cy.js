import ColorThumbnail from './ColorThumbnail';
import { mountWithTheme as mount } from '../../models/test-utils';

describe('Color Thumbnail', () => {
  const color = '#ff7';

  it('renders', () => {
    // thumbnail adjusts to height of parent
    mount(
      <div style={{ height: '24px' }}>
        <ColorThumbnail color={color} />
      </div>,
    );
  });
});
