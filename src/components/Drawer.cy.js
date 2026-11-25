import { Box, Typography } from '@mui/material';
import Portal from '@mui/material/Portal';
import log from 'loglevel';
import React from 'react';
import Drawer from './Drawer';
import { mountWithTheme as mount } from '../models/test-utils';

describe('CustomWorldMap', () => {
  it('renders', () => {
    cy.viewport('iphone-6+');
    function Test() {
      const [open, setOpen] = React.useState(false);
      function load() {
        setTimeout(() => {
          log.warn('test');
          setOpen(true);
        }, 100);
      }
      React.useEffect(() => {
        load();
      }, []);
      return (
        <>
          <Box
            sx={{
              position: 'fixed',
              height: '100vh',
            }}
          >
            Test
          </Box>
          <Drawer>
            {Array.from(Array(10).keys()).map((i) => (
              <Typography key={i} variant="h2">
                Drawer content
              </Typography>
            ))}
          </Drawer>
          {open && (
            <Portal
              container={document.getElementById('drawer-title-container')}
            >
              <Box>
                <Typography variant="h6">Drawer Title</Typography>
                <Typography variant="h6">Drawer Title</Typography>
                <Typography variant="h6">Drawer Title</Typography>
              </Box>
            </Portal>
          )}
          {open && (
            <Portal
              container={document.getElementById('drawer-title-container-min')}
            >
              <Box>
                <Typography variant="h6">Drawer Title</Typography>
              </Box>
            </Portal>
          )}
        </>
      );
    }
    mount(<Test />);
  });

  it('does not log an error when the drawer is touched', () => {
    cy.viewport('iphone-6+');
    cy.spy(log, 'error').as('logError');
    mount(
      <Drawer>
        <Typography variant="h2">Drawer content</Typography>
      </Drawer>,
    );

    cy.get('.drawer-root').trigger('touchstart', {
      touches: [{ pageY: 300 }],
      force: true,
    });

    cy.get('@logError').should('not.have.been.called');
  });
});
