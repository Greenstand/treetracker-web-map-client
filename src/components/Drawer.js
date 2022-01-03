import { Global } from '@emotion/react';
import ExpandLess from '@mui/icons-material/ExpandLess';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';
import withStyles from '@mui/styles/withStyles';
import log from 'loglevel';
import React, { useEffect, useRef, useState } from 'react';

function Drawer(props) {
  const { children } = props;
  const [open, setOpen] = useState(true);

  function handleClickBottom() {
    setOpen(true);
  }
  return (
    <>
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: `90vh`,
            overflow: 'visible',
            // position: 'absolute',
          },
        }}
      />
      <SwipeableDrawer
        anchor={'bottom'}
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        disableSwipeToOpen={true}
        BackdropProps={{ open: false }}
        sx={{
          backgroundColor: 'transparent',
          overflow: 'visible',
          position: 'relative',
          zIndex: 900,
        }}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Box>{children}</Box>
      </SwipeableDrawer>
      {!open && (
        <Paper
          sx={{
            pointerEvents: 'auto',
            width: '100%',
            position: 'fixed',
            bottom: 0,
            boxShadow: '0 -1px 2px rgb(0 0 0 / 30%)',
            zIndex: 1000,
            borderRadius: '8px 8px 0 0 ',
          }}
          onClick={handleClickBottom}
        >
          <Grid
            container
            sx={{
              height: 50,
            }}
            wrap="nowrap"
            pt={1}
          >
            <Grid
              item
              p={1}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ExpandLess color="action" />
            </Grid>
            <Grid
              item
              sx={{
                flexGrow: 1,
              }}
            >
              <Grid
                container
                sx={{
                  height: '100%',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Grid item ml={1}>
                  <Avatar width={3} height={3} />
                </Grid>
                <Grid item ml={1}>
                  <Typography variant="h6">@$</Typography>
                </Grid>
                <Grid item ml={1}>
                  <Typography variant="body1">tokens</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      )}
    </>
  );
}

export default Drawer;
