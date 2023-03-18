import { PlaygroundProvider } from 'context/playgroundContext';
import { mountWithTheme as mount } from 'models/test-utils';
import FontCustomization from './FontCustomization';

describe('Font Customization', () => {
  it('renders', () => {
    mount(
      <PlaygroundProvider>
        <FontCustomization />
      </PlaygroundProvider>,
    );
  });
});
