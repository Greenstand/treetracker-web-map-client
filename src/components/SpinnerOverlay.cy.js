import Paper from '@mui/material/Paper';
import React from 'react';
import SpinnerOverlay from './SpinnerOverlay';
import { mountWithTheme as mount } from '../models/test-utils';

describe('SpinnerOverlay', () => {
  it('renders', () => {
    cy.viewport(1200, 800);
    function Test() {
      const [loading, setLoading] = React.useState(false);
      const load = () => setTimeout(() => setLoading(true), '1000');
      const dimensions = {
        width: '100%',
        height: '100%',
      };
      React.useEffect(() => load());
      return (
        <Paper id="container" sx={{ ...dimensions, position: 'relative' }}>
          {loading && <SpinnerOverlay sx={dimensions} />}
        </Paper>
      );
    }
    mount(<Test />);
    if (!cy.get('.MuiPaper-root'))
      cy.get('MuiPaper-root', {
        timeout: '1500',
      }).contains('svg');
  });
});
