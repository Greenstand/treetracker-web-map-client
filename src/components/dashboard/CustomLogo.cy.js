import { ConfigProvider } from 'context/configContext';
import { mountWithTheme as mount } from 'models/test-utils';
import CustomLogo from './CustomLogo';

describe('CustomLogo', () => {
  it('renders', () => {
    mount(
      <ConfigProvider>
        <CustomLogo />
      </ConfigProvider>,
    );
  });
});
