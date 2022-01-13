import { Global } from '@emotion/react';
import ExpandLess from '@mui/icons-material/ExpandLess';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';
import log from 'loglevel';
import React, { useEffect, useState } from 'react';

const Root = styled('div')(() => ({
  height: '100%',
}));


const StyledBox = styled(Box)(() => ({}));

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.textLight.main,
  borderRadius: 3,
  position: 'absolute',
  top: 8,
}));

function Drawer(props) {
  const { children } = props;
  const [open, setOpen] = useState(true);
  const [hasHeight, setHasHeight] = useState(0);
  const defaultHeight = 200;

  useEffect(() => {
    if (hasHeight <= 0) {
      setHasHeight(0);
    } else if (hasHeight >= 600) {
      /* Close the SwipeableDrawer if the hasHeight is greater than 600 */
      setOpen(false);
    } else {
      /* return any value the hasHeight state has */
      setHasHeight(hasHeight);
    }
  }, [hasHeight]);

  const handleTouch = (event) => {
    event.stopPropagation();

    const touches = event.targetTouches && event.targetTouches[0];

    setHasHeight(Math.round(touches?.clientY || defaultHeight));
  };

  function handleClickBottom() {
    setOpen(true);
    setHasHeight(defaultHeight);
  }
  return (
    <Root>
      <CssBaseline />
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: '90vh',
            overflow: 'visible',
            transform: `translate(0px, ${hasHeight}px) !important`,
          },
        }}
      />
      {!open && (
        <StyledBox
          sx={{
            position: 'absolute',
            top: -56,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: 'visible',
            right: 0,
            left: 0,
          }}
        >
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
        </StyledBox>
      )}
      <SwipeableDrawer
        onTouchMove={handleTouch}
        onMouseMove={handleTouch}
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        disableSwipeToOpen={false}
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
        <StyledBox
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 4,
          }}
        >
          <Puller />
        </StyledBox>
        {children}
      </SwipeableDrawer>
    </Root>
  );
}

export default Drawer;
