import { PlaygroundProvider } from 'context/playgroundContext';
import { mountWithTheme as mount } from 'models/test-utils';
import ToggleThemeMode from './ToggleThemeMode';

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
