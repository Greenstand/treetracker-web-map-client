import { DashboardProvider } from 'context/dashboardContext';
import { mountWithTheme as mount } from 'models/test-utils';
import CustomizeNavbar from './CustomizeNavbar';

describe('CustomizeNavbar', () => {
  it('renders', () => {
    mount(
      <DashboardProvider>
        <CustomizeNavbar />
      </DashboardProvider>,
    );
  });
});
