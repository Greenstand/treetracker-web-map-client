import FontCustomization from './FontCustomization';
import { PlaygroundProvider } from '../../context/playgroundContext';
import { mountWithTheme as mount } from '../../models/test-utils';

describe('Font Customization', () => {
  it('renders', () => {
    mount(
      <PlaygroundProvider>
        <FontCustomization />
      </PlaygroundProvider>,
    );
  });
});
