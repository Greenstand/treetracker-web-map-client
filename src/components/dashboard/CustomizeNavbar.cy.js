import { ConfigProvider } from 'context/configContext';
import { mountWithTheme as mount } from 'models/test-utils';
import CustomizeNavbar from './CustomizeNavbar';

describe('CustomizeNavbar', () => {
  it('renders', () => {
    mount(
      <ConfigProvider>
        <CustomizeNavbar />
      </ConfigProvider>,
    );
  });
});
