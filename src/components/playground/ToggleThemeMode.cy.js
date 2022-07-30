import ToggleThemeMode from './ToggleThemeMode';
import { PlaygroundProvider } from '../../context/playgroundContext';
import { mountWithTheme as mount } from '../../models/test-utils';

describe('Toggle Theme Mode', () => {
  it('renders', () => {
    mount(
      <PlaygroundProvider>
        <ToggleThemeMode />
      </PlaygroundProvider>,
    );
  });

  it('toggles theme mode', () => {
    mount(
      <PlaygroundProvider>
        <ToggleThemeMode />
      </PlaygroundProvider>,
    );
    cy.get('.MuiSwitch-input').click();
  });
});
