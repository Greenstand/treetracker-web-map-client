import ColorInput from './ColorInput';
import { mountWithTheme as mount } from '../../models/test-utils';

describe('Color Input', () => {
  const name = 'main';
  const value = '#ff7';

  it('renders', () => {
    mount(<ColorInput label={name} initial={value} onChange={console.log} />);
  });

  it('gives error on invalid syntax', () => {
    mount(<ColorInput label={name} initial={value} onChange={console.log} />);
    cy.get('.MuiFormControl-root').type('z').contains('Invalid syntax');
  });
});
