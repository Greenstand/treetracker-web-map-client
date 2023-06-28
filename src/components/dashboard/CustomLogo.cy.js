import { DashboardProvider } from 'context/dashboardContext';
import { mountWithTheme as mount } from 'models/test-utils';
import CustomLogo from './CustomLogo';

describe('CustomLogo', () => {
  it('renders', () => {
    mount(
      <DashboardProvider>
        <CustomLogo />
      </DashboardProvider>,
    );
  });
});
